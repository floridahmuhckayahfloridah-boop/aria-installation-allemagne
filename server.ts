import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { searchOfflineResources } from './src/services/offlineSearchService';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// The app is normally hosted behind one reverse proxy (Render, Railway, etc.).
app.set('trust proxy', 1);
app.disable('x-powered-by');

// Basic security headers. HTTPS is supplied by the hosting platform in production.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=(self)');
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Small in-memory limiter for the first closed beta. Use a shared store (e.g. Redis)
// before scaling to multiple server instances; this is not a substitute for a WAF.
const requestBuckets = new Map<string, { count: number; resetAt: number }>();
function rateLimit(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const now = Date.now();
    const key = `${req.ip || req.socket.remoteAddress || 'unknown'}:${req.path}`;
    let bucket = requestBuckets.get(key);
    if (!bucket || bucket.resetAt <= now) {
      bucket = { count: 0, resetAt: now + windowMs };
      requestBuckets.set(key, bucket);
    }
    bucket.count += 1;
    if (requestBuckets.size > 5000) {
      for (const [entryKey, entry] of requestBuckets) {
        if (entry.resetAt <= now) requestBuckets.delete(entryKey);
      }
    }
    if (bucket.count > maxRequests) {
      res.setHeader('Retry-After', String(Math.ceil((bucket.resetAt - now) / 1000)));
      return res.status(429).json({
        error: 'Trop de demandes en peu de temps.',
        message: 'Veuillez patienter quelques minutes avant de réessayer.',
        code: 'RATE_LIMITED',
      });
    }
    next();
  };
}

// Gemini API client: pass the key explicitly. The SDK's default Node.js
// environment lookup uses GOOGLE_API_KEY, while AI Studio commonly injects
// GEMINI_API_KEY. Supporting both avoids a silent authentication mismatch.
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
const getGeminiClient = () => {
  if (!geminiApiKey) {
    throw new Error('Configuration Gemini absente : ajoutez GEMINI_API_KEY dans les secrets du serveur.');
  }
  return new GoogleGenAI({ apiKey: geminiApiKey });
};

// Health check for hosting-platform deployment probes. Never returns secrets.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'aria-api', geminiConfigured: Boolean(geminiApiKey) });
});

// API: Document Analysis (OCR + Translation + Obligations + Deadlines)
app.post('/api/analyze-document', rateLimit(5, 15 * 60 * 1000), express.json({ limit: '18mb' }), async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64 : '';
    const mimeType = typeof body.mimeType === 'string' ? body.mimeType : 'image/jpeg';
    const textInput = typeof body.textInput === 'string' ? body.textInput.trim() : '';
    const profileType = typeof body.profileType === 'string' ? body.profileType.slice(0, 120) : '';

    if (imageBase64.length > 17_000_000 || textInput.length > 18_000) {
      return res.status(413).json({ error: 'Document trop volumineux.', message: 'Réduisez la taille de la photo ou du texte puis réessayez.' });
    }
    if (imageBase64 && !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return res.status(415).json({ error: 'Format image non pris en charge.', message: 'Utilisez une image JPG, PNG ou WebP.' });
    }
    if (!imageBase64 && !textInput) {
      return res.status(400).json({ error: 'Une image ou un texte allemand est requis pour l’analyse.' });
    }

    const systemPrompt = `Tu es ARIA, l'assistante administrative experte pour les jeunes francophones arrivant en Allemagne (Au Pair, FSJ/BFD, Ausbildung, Université, etc.).
Tu reçois un document administratif ou contractuel allemand. Ton rôle est de le déchiffrer, de rassurer le jeune arrivant, de lui expliquer exactement de quoi il s'agit en français simple, et de lui lister ses obligations et dates butoirs.

Profil du jeune : ${profileType || 'Jeune francophone nouvellement arrivé en Allemagne'}.

Tu dois répondre EXCLUSIVEMENT au format JSON valide avec la structure suivante :
{
  "documentType": "Nom du document en allemand et français (ex: Meldebestätigung / Attestation de domicile, Mietvertrag / Contrat de bail, Rundfunkbeitrag / Redevance TV-Radio)",
  "issuer": "Organisme émetteur (ex: Bürgeramt Berlin, TK Techniker Krankenkasse, Vermieter)",
  "urgencyLevel": "urgent" | "attention" | "normal" | "information",
  "summary": "Résumé clair et bienveillant en 2 à 3 phrases expliquant ce que ce document signifie concrètement pour l'utilisateur.",
  "extractedTextSample": "Extrait du texte allemand détecté",
  "importantDates": [
    {
      "date": "Date ou délai mentionné (ex: 14 jours, avant le 15.11.2026)",
      "label": "Explication de cette date (ex: Date limite de réponse ou de paiement)"
    }
  ],
  "obligations": [
    "Obligation concrète 1 (ex: Renvoyer le formulaire signé avant le...)",
    "Obligation concrète 2 (ex: Faire viser ce document par votre famille d'accueil)"
  ],
  "financialImpact": "Détail financier s'il y en a un (ex: 18,36 € / mois, Caution de 800 €, Aucun paiement requis)",
  "actionSteps": [
    "Étape 1 : Ce qu'il faut faire immédiatement",
    "Étape 2 : Où déposer ou envoyer le document",
    "Étape 3 : Qui contacter en cas de doute"
  ],
  "pitfallsToAvoid": "Ce qu'il ne faut ABSOLUMENT PAS faire ou ignorer (ex: Ne pas jeter cette lettre car le numéro de taxe d'habitation y figure)",
  "keyVocabulary": [
    {"german": "Frist", "french": "Délai limite"},
    {"german": "Unterschrift", "french": "Signature"}
  ],
  "officialSource": "Nom de l'administration officielle ou du texte légal de référence (ex: Bundesmeldegesetz § 17 BMG, ARD ZDF Deutschlandradio Beitragsservice)"
}`;

    const contents: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }

    const userPrompt = textInput 
      ? `Analyse ce document administratif allemand :\n\n"""\n${textInput}\n"""`
      : `Analyse cette photographie/numérisation de document administratif allemand. Effectue l'OCR du texte et fournis l'analyse structurée détaillée en français.`;

    contents.push({ text: userPrompt });

    const response = await getGeminiClient().models.generateContent({
      model: geminiModel,
      contents: contents,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      parsedData = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: 'Format JSON inattendu' };
    }

    return res.json({
      success: true,
      analysis: parsedData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error analyzing document with Gemini:', error);
    const message = String(error?.message || 'Erreur inconnue');
    const providerStatus = Number(error?.status || error?.statusCode || error?.code);
    const status = providerStatus === 429 || providerStatus === 503 || /quota|resource.exhausted|rate.?limit|429|503|unavailable|overloaded/i.test(message) ? 503 : 502;
    return res.status(status).json({
      error: 'L’analyse en ligne est momentanément indisponible.',
      message: 'Vérifiez la configuration Gemini, les quotas et la connexion, puis réessayez. Vous pouvez utiliser le mode local pour une première lecture.',
      code: status === 503 ? 'GEMINI_UNAVAILABLE_OR_QUOTA' : 'GEMINI_PROVIDER_ERROR',
    });
  }
});

// API: AI Assistant Q&A
app.post('/api/chat', rateLimit(20, 15 * 60 * 1000), express.json({ limit: '200kb' }), async (req, res) => {
  try {
    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const userProfile = body.userProfile && typeof body.userProfile === 'object' ? body.userProfile : null;
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }
    if (message.length > 4000 || history.some((item: any) => typeof item?.content !== 'string' || item.content.length > 3000)) {
      return res.status(413).json({ error: 'Conversation trop longue.', message: 'Raccourcissez votre message ou recommencez une conversation.' });
    }

    const safeStatus = typeof userProfile?.status === 'string' ? userProfile.status.slice(0, 40) : 'Au Pair / Étudiant';
    const safeCity = typeof userProfile?.city === 'string' ? userProfile.city.slice(0, 80) : 'Allemagne';
    const safeArrival = typeof userProfile?.arrivalDate === 'string' ? userProfile.arrivalDate.slice(0, 20) : 'Récemment';
    const profileContext = userProfile
      ? `Statut: ${safeStatus}, Ville: ${safeCity}, Arrivé le: ${safeArrival}`
      : 'Jeune arrivant en Allemagne';

    // Retrieve the most relevant local knowledge entries and pass them to Gemini.
    // This gives the online assistant a grounded starting point instead of a generic answer.
    const knowledgeMatches = searchOfflineResources(message, 5);
    const knowledgeContext = knowledgeMatches.length
      ? knowledgeMatches.map((item, index) =>
          `${index + 1}. [${item.kind}] ${item.title}\nRésumé : ${item.summary}\nDétails : ${item.details.slice(0, 6).join(' | ')}\nRéférence : ${item.reference || 'non renseignée'}\nPrudence : ${item.notice}`
        ).join('\n\n')
      : 'Aucune fiche locale directement correspondante n’a été trouvée.';

    const systemInstruction = `Tu es ARIA, la conseillère administrative et compagne bienveillante des jeunes francophones arrivant en Allemagne (notamment Au Pair, Volontaires FSJ/BFD, étudiants et apprentis Ausbildung, avec une attention spéciale et fraternelle pour ceux venant de Madagascar et d'Afrique francophone).

Ton style :
- Chaleureux, rassurant, précis, sans jargon inutile.
- Tu donnes toujours des démarches pas à pas concrètes et datées.
- Tu cites les sources et termes officiels en allemand (ex: Anmeldung, Bürgeramt, Ausländerbehörde, Rundfunkbeitrag, Sperrkonto, Krankenkasse, Steuernummer).
- Tu expliques les droits du jeune uniquement lorsque les fiches documentaires ou une source officielle pertinente les étayent; ne transforme pas des exemples en règles universelles.
- Tu donnes des conseils pratiques pour la vie quotidienne, la santé, et la gestion du choc culturel ou de l'éloignement familial.

Contexte utilisateur : ${profileContext}.

RÈGLES DE FIABILITÉ :
- Utilise les fiches documentaires ci-dessous lorsqu’elles correspondent à la question.
- Ne présente jamais une fiche locale comme une vérification juridique récente : précise qu’il s’agit d’une référence documentaire ARIA à confirmer auprès de l’autorité compétente.
- Ne fabrique jamais de date limite, montant, droit, adresse, numéro de téléphone ou lien officiel.
- Si une règle dépend du Land, de la ville, du statut ou de la date, demande le détail manquant ou indique clairement cette dépendance.
- Si les fiches ne couvrent pas la question, réponds prudemment et indique ce qui doit être vérifié.
- Réponds en français simple, avec des étapes concrètes et une section « À vérifier » lorsque nécessaire.

FICHES DOCUMENTAIRES ARIA RETROUVÉES :
${knowledgeContext}`;

    const formattedHistory = history
      .filter((msg: any) => msg && (msg.role === 'user' || msg.role === 'model') && typeof msg.content === 'string')
      .map((msg: any) => ({
        role: msg.role,
        parts: [{ text: msg.content.slice(0, 3000) }],
      }));

    const contents = [
      ...formattedHistory,
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await getGeminiClient().models.generateContent({
      model: geminiModel,
      contents: contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text || 'Désolé, je n’ai pas pu générer de réponse.',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in chat API:', error);
    const message = String(error?.message || 'Erreur inconnue');
    const providerStatus = Number(error?.status || error?.statusCode || error?.code);
    const status = providerStatus === 429 || providerStatus === 503 || /quota|resource.exhausted|rate.?limit|429|503|unavailable|overloaded/i.test(message) ? 503 : 502;
    return res.status(status).json({
      error: 'ARIA ne peut pas joindre son assistant en ligne pour le moment.',
      message: 'Vérifiez la configuration Gemini, les quotas et la connexion. Une réponse documentaire locale peut être proposée à la place.',
      code: status === 503 ? 'GEMINI_UNAVAILABLE_OR_QUOTA' : 'GEMINI_PROVIDER_ERROR',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ARIA server ready — open http://localhost:${PORT}`);
  });
}

startServer();
