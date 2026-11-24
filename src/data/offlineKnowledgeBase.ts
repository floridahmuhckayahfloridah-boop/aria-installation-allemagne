export interface OfflineKnowledgeItem {
  id: string;
  keywords: string[];
  title: string;
  category: 'anmeldung' | 'au_pair' | 'fsj' | 'bank' | 'insurance' | 'rundfunk' | 'visa' | 'urgence' | 'madagascar';
  answerFr: string;
  officialRef: string;
}

export const OFFLINE_KNOWLEDGE_BASE: OfflineKnowledgeItem[] = [
  {
    id: 'offline-anmeldung',
    keywords: ['anmeldung', 'mairie', 'buergeramt', 'domicile', 'enregistrer', 'adresse', 'meldebestätigung', 'wohnungsgeberbestätigung'],
    title: 'Déclaration de domicile (Anmeldung) — Guide local',
    category: 'anmeldung',
    answerFr: `L'Anmeldung est l'obligation légale de déclarer votre adresse en mairie (Bürgeramt) sous 14 jours calendaires.

Pièces indispensables :
1. Votre passeport original avec visa.
2. La Wohnungsgeberbestätigung signée par votre logeur ou famille d'accueil (indispensable, le contrat de bail seul ne suffit pas).
3. Le formulaire d'Anmeldung rempli.

Après l'enregistrement, vous recevrez sur-le-champ votre "Meldebestätigung" (gardez-en une copie photo et 2 copies papier). Votre identifiant fiscal (Steuer-ID) vous sera envoyé par la poste environ 2 à 3 semaines plus tard.`,
    officialRef: '§ 17 BMG (Bundesmeldegesetz) — Novembre 2026'
  },
  {
    id: 'offline-au-pair-droits',
    keywords: ['au pair', 'horaires', 'heures', 'argent de poche', 'taschengeld', 'famille', 'repos', 'ménage'],
    title: 'Vos droits stricts en tant qu’Au-Pair en Allemagne',
    category: 'au_pair',
    answerFr: `En Allemagne, le statut Au-Pair est strictement encadré par l'Agence Fédérale pour l'Emploi (Bundesagentur für Arbeit) :

1. Horaires : Maximum 30 heures par semaine et max 6 heures par jour (baby-sitting inclus).
2. Argent de poche (Taschengeld) : Minimum 280 € nets par mois (à verser même en cas de maladie ou congés).
3. Cours de langue (Sprachkurs) : La famille DOIT légalement participer à hauteur de 70 € par mois pour vos cours d'allemand.
4. Assurance : 100% payée par la famille d'accueil (santé, responsabilité civile, rapatriement).
5. Congés : Au moins 1,5 jour de repos par semaine (dont 1 dimanche par mois) et 4 semaines de congés payés par an.
6. Tâches ménagères : Uniquement les tâches légères liées aux enfants. Vous n'êtes pas employée de maison générale.`,
    officialRef: 'Directives fédérales de la Bundesagentur für Arbeit — BA 2026'
  },
  {
    id: 'offline-fsj-droits',
    keywords: ['fsj', 'bfd', 'volontariat', 'séminaires', 'indemnité', 'sécurité sociale'],
    title: 'Règles du Freiwilliges Soziales Jahr (FSJ / BFD)',
    category: 'fsj',
    answerFr: `Le FSJ et le BFD sont des programmes de volontariat civique en Allemagne :

1. Durée légale : Généralement 12 mois (extensible jusqu'à 18 mois).
2. Rémunération : Argent de poche (Taschengeld) et indemnités repas/logement (environ 400 € à 550 € / mois selon la région).
3. Sécurité sociale : Votre structure d'accueil paie 100% de vos cotisations d'assurance maladie (GKV), chômage et retraite.
4. Séminaires obligatoires : 25 jours de séminaires de formation pédagogique par an, entièrement rémunérés et pris en charge (frais de transport et hébergement inclus).
5. Congés payés : Au moins 24 à 30 jours de congés selon votre contrat.`,
    officialRef: 'Jugendfreiwilligendienstegesetz (JFDG) & BFDG'
  },
  {
    id: 'offline-rundfunkbeitrag',
    keywords: ['rundfunkbeitrag', 'redevance', 'ard', 'zdf', 'télé', 'radio', 'lettre', 'taxe', '18'],
    title: 'Redevance TV & Radio (Rundfunkbeitrag ARD/ZDF)',
    category: 'rundfunk',
    answerFr: `ATTENTION : Dès votre Anmeldung, vous recevrez une lettre officielle d'ARD ZDF Deutschlandradio vous réclamant 18,36 €/mois.

Comment réagir :
- Si vous êtes Au-Pair : La famille d'accueil paie déjà pour toute la maison ! Demandez-leur leur "Beitragsnummer" (numéro de cotisation) et signalez sur leur site web que vous habitez déjà dans ce logement. Vous paierez 0 €.
- Si vous êtes en colocation (WG) : Demandez au colocataire qui paie déjà son numéro de contribution.
- Ne jetez JAMAIS la lettre sans y répondre : les pénalités et mises en demeure s'accumulent vite.`,
    officialRef: 'Rundfunkbeitragsstaatsvertrag (RBStV)'
  },
  {
    id: 'offline-bank-account',
    keywords: ['banque', 'compte', 'girokonto', 'iban', 'n26', 'revolut', 'sparkasse', 'argent'],
    title: 'Ouvrir un compte bancaire en Allemagne (Girokonto)',
    category: 'bank',
    answerFr: `Pour recevoir votre argent de poche ou salaire et payer votre forfait téléphone, un IBAN allemand (commençant par DE) est indispensable.

Options recommandées :
- Banques mobiles gratuites (N26, Revolut DE) : Inscription en 10 minutes depuis l'application, vérification vidéo avec votre passeport, carte de débit virtuelle et physique.
- Banques avec agence (Sparkasse, Deutsche Bank) : Utile si vous devez déposer du liquide souvent, mais nécessite un rendez-vous et votre Meldebestätigung originale.`,
    officialRef: '§ 31 ZKG (Zahlungskontengesetz)'
  },
  {
    id: 'offline-urgences-allemagne',
    keywords: ['urgence', 'secours', 'police', 'pompier', 'malade', 'nuit', '112', '110', '116117'],
    title: 'Numéros d’urgence indispensables en Allemagne',
    category: 'urgence',
    answerFr: `Numéros gratuits 24h/24 en Allemagne :
- 112 : Pompiers & Urgences Médicales vitales (Feuerwehr & Rettungsdienst).
- 110 : Police Secours (Polizei).
- 116 117 : Médecin de garde non-vital (quand le cabinet est fermé le soir ou le week-end).
- 116 116 : Opposition immédiate en cas de perte ou vol de carte bancaire ou téléphone.`,
    officialRef: 'Numéros d’urgence fédéraux allemands'
  },
  {
    id: 'offline-madagascar-ambassade',
    keywords: ['madagascar', 'ambassade', 'consulat', 'passeport', 'malagasy', 'rapatriement', 'berlin'],
    title: 'Services consulaires de Madagascar en Allemagne',
    category: 'madagascar',
    answerFr: `Ambassade de Madagascar en République Fédérale d’Allemagne :
- Adresse : Seepromenade 92, 14612 Falkensee (près de Berlin).
- Téléphone : +49 3322 23140
- Email officiel : info@botschaft-madagaskar.de

Formalités disponibles :
- Renouvellement et délivrance de passeports biométriques malgaches.
- Actes d'état civil, procurations et légalisations de documents.
- Assistance aux ressortissants et étudiants en situation d'urgence.`,
    officialRef: 'Représentation diplomatique de Madagascar'
  }
];

/**
 * Normalise le français et l’allemand sans perdre les variantes phonétiques
 * utiles sur les claviers francophones (ä -> ae, ö -> oe, ü -> ue, ß -> ss).
 */
export function normalizeSearchText(value: string): string {
  return (value || '')
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const SEARCH_SYNONYMS: Record<string, string[]> = {
  anmeldung: ['declaration de domicile', 'buergeramt', 'buergerbuero', 'mairie', 'wohnungsgeberbestaetigung', 'meldebestaetigung'],
  buergeramt: ['anmeldung', 'mairie', 'declaration de domicile'],
  mairie: ['anmeldung', 'buergeramt', 'declaration de domicile'],
  visa: ['visum', 'aufenthaltstitel', 'auslaenderbehoerde', 'titre de sejour'],
  'assurance maladie': ['krankenversicherung', 'krankenkasse', 'gesundheitskarte', 'aok', 'tk'],
  krankenversicherung: ['assurance maladie', 'krankenkasse', 'sante'],
  urgence: ['notruf', '112', '110', 'rettungsdienst', 'polizei', '116117', 'secours'],
  urgences: ['notruf', '112', '110', 'rettungsdienst', 'polizei', '116117', 'secours'],
  'au pair': ['au-pair', 'gastfamilie', 'taschengeld', 'famille accueil'],
  fsj: ['bfd', 'volontariat', 'freiwilligendienst'],
  bfd: ['fsj', 'volontariat', 'freiwilligendienst'],
  rundfunkbeitrag: ['redevance', 'ard', 'zdf', 'radio', 'tele'],
  redevance: ['rundfunkbeitrag', 'ard', 'zdf'],
  'compte bancaire': ['girokonto', 'basiskonto', 'iban', 'bafin'],
  girokonto: ['compte bancaire', 'basiskonto', 'iban'],
  madagascar: ['ambassade', 'consulat', 'malagasy', 'passeport'],
};

function expandSearchTerms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  const terms = new Set(normalized.split(' ').filter(term => term.length > 2));

  for (const [phrase, synonyms] of Object.entries(SEARCH_SYNONYMS)) {
    if (normalized.includes(normalizeSearchText(phrase))) {
      for (const synonym of synonyms) {
        for (const term of normalizeSearchText(synonym).split(' ')) {
          if (term.length > 2) terms.add(term);
        }
      }
    }
  }

  return [...terms];
}

export function searchOfflineKnowledge(query: string): OfflineKnowledgeItem[] {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const cleanTokens = expandSearchTerms(query);
  const scored = OFFLINE_KNOWLEDGE_BASE.map(item => {
    const title = normalizeSearchText(item.title);
    const keywords = item.keywords.map(normalizeSearchText);
    const answer = normalizeSearchText(item.answerFr);
    const targetText = `${title} ${keywords.join(' ')} ${answer}`;
    let score = 0;

    if (targetText.includes(normalizedQuery)) score += 12;
    if (title.includes(normalizedQuery)) score += 8;

    for (const token of cleanTokens) {
      if (keywords.some(keyword => keyword === token || keyword.includes(token) || token.includes(keyword))) score += 5;
      if (title.includes(token)) score += 3;
      else if (targetText.includes(token)) score += 1;
    }

    return { item, score };
  });

  return scored
    .filter(result => result.score >= 4)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item);
}
