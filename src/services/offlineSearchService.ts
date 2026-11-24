/** Recherche unifiée dans les ressources embarquées d'ARIA.
 * Les contenus sont des références locales : ce service ne certifie pas leur actualité juridique.
 */
import { ADMINISTRATIVE_PROCEDURES } from '../data/administrativeProcedures';
import { OFFLINE_KNOWLEDGE_BASE } from '../data/offlineKnowledgeBase';
import { MAP_PLACES, EMERGENCY_NUMBERS } from '../data/germanCitiesPlaces';
import { GERMAN_CURRICULUM } from '../data/germanCurriculum';

export type OfflineResourceKind = 'procedure' | 'knowledge' | 'place' | 'emergency' | 'german_lesson';
export interface OfflineSearchResult {
  id: string;
  kind: OfflineResourceKind;
  title: string;
  summary: string;
  details: string[];
  reference?: string;
  keywords?: string[];
  score: number;
  notice: string;
}

export function normalizeOfflineText(value: string): string {
  return (value || '').toLocaleLowerCase('de-DE')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9§]+/g, ' ').replace(/\s+/g, ' ').trim();
}

const SYNONYMS: Record<string, string[]> = {
  anmeldung: ['declaration domicile', 'buergeramt', 'meldebehoerde', 'wohnungsgeberbestaetigung', 'meldebestaetigung'],
  domicile: ['anmeldung', 'buergeramt', 'wohnsitz anmelden'],
  visa: ['visum', 'nationalvisum', 'aufenthaltstitel', 'auslaenderbehoerde', 'titre sejour'],
  banque: ['girokonto', 'basiskonto', 'iban', 'konto'],
  compte: ['girokonto', 'basiskonto', 'iban', 'bankkonto'],
  assurance: ['krankenversicherung', 'krankenkasse', 'gesundheitskarte', 'egk'],
  sante: ['gesundheit', 'krankenversicherung', 'krankenkasse', 'arzt'],
  urgence: ['notruf', '112', '110', 'rettungsdienst', 'polizei', '116117'],
  police: ['polizei', '110'],
  hopital: ['krankenhaus', 'notaufnahme', '112'],
  aupair: ['au pair', 'au-pair', 'gastfamilie', 'taschengeld', 'sprachkurs'],
  volontariat: ['fsj', 'bfd', 'freiwilligendienst'],
  fsj: ['bfd', 'freiwilligendienst', 'volontariat'],
  redevance: ['rundfunkbeitrag', 'beitragsservice', 'ard', 'zdf'],
  impots: ['steuer id', 'steueridentifikationsnummer', 'finanzamt'],
  fiscal: ['steuer id', 'steueridentifikationsnummer', 'finanzamt'],
  madagascar: ['ambassade', 'consulat', 'malagasy', 'passeport'],
  allemand: ['deutsch', 'grammaire', 'vocabulaire', 'dialogue', 'wortschatz'],
};

const STOP_WORDS = new Set([
  'bonjour', 'salut', 'aria', 'allemagne', 'allemand', 'allemande', 'allemands',
  'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se',
  'mon', 'ma', 'mes', 'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'un', 'une', 'des',
  'le', 'la', 'les', 'du', 'de', 'd', 'au', 'aux', 'en', 'dans', 'sur', 'pour',
  'avec', 'sans', 'et', 'ou', 'mais', 'donc', 'que', 'qui', 'quoi', 'dont',
  'est', 'sont', 'etre', 'avoir', 'faire', 'fait', 'peux', 'peut', 'dois', 'doit',
  'comment', 'pourquoi', 'quand', 'combien', 'quel', 'quelle', 'quels', 'quelles',
  'bonjour', 'merci', 'svp', 'sil', 'plait', 'viens', 'arrive', 'arriver',
  'premier', 'premiere', 'premiers', 'premieres', 'trois', 'deux', 'troisieme',
  'donner', 'dire', 'expliquer', 'savoir', 'connaitre', 'question', 'questions',
]);

function termsFor(query: string): string[] {
  const normalized = normalizeOfflineText(query);
  const terms = new Set(normalized.split(' ').filter(t => t.length > 2 && !STOP_WORDS.has(t)));
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    const normalizedKey = normalizeOfflineText(key);
    if (normalizedKey && normalized.includes(normalizedKey)) {
      for (const synonym of synonyms) {
        normalizeOfflineText(synonym).split(' ')
          .filter(t => t.length > 2 && !STOP_WORDS.has(t))
          .forEach(t => terms.add(t));
      }
    }
  }
  return [...terms];
}

function scoreResource(query: string, terms: string[], title: string, body: string, keywords: string[] = []): number {
  const q = normalizeOfflineText(query);
  const titleTerms = normalizeOfflineText(title).split(' ');
  const bodyText = normalizeOfflineText(body);
  const keywordTerms = keywords.flatMap(keyword => normalizeOfflineText(keyword).split(' '));
  let score = 0;

  // A full query match is strong evidence; incidental words in a long answer are not.
  if (q.length > 3 && normalizeOfflineText(title).includes(q)) score += 15;

  for (const term of terms) {
    if (titleTerms.includes(term)) score += 6;
    else if (titleTerms.some(titleTerm => titleTerm.startsWith(term) && term.length >= 4)) score += 3;

    if (keywordTerms.includes(term)) score += 7;
    else if (keywords.some(keyword => normalizeOfflineText(keyword).includes(term) && term.length >= 4)) score += 3;

    // Body matches are deliberately weak: they must not make an unrelated answer rank highly.
    if (bodyText.split(' ').includes(term)) score += 0.5;
  }
  return score;
}

function buildIndex(): Omit<OfflineSearchResult, 'score'>[] {
  const results: Omit<OfflineSearchResult, 'score'>[] = [];

  for (const p of ADMINISTRATIVE_PROCEDURES) {
    const details = [
      `Échéance indiquée : ${p.legalDeadline}`,
      `Base juridique indiquée : ${p.legalBasis}`,
      `Documents : ${p.requiredDocuments.join('; ')}`,
      ...p.steps.map(s => `${s.stepNumber}. ${s.title} — ${s.description}${s.tips ? ` Conseil : ${s.tips}` : ''}`),
      ...p.commonPitfalls.map(x => `Attention : ${x}`),
      `Coût indiqué : ${p.financialCost}`,
    ];
    results.push({ id: p.id, kind: 'procedure', title: p.title, summary: p.shortSummary, details,
      reference: `${p.officialSourceName} — ${p.officialSourceUrl} — ${p.legalBasis}`,
      notice: 'Fiche de procédure intégrée au projet ARIA. Les dates, montants, conditions locales et références doivent être revérifiés auprès de la source officielle avant décision.' });
  }

  for (const item of OFFLINE_KNOWLEDGE_BASE) {
    results.push({ id: item.id, kind: 'knowledge', title: item.title, summary: item.answerFr, details: [], reference: item.officialRef, keywords: item.keywords,
      notice: 'Fiche documentaire locale ARIA ; ce contenu n’est pas une vérification juridique en temps réel.' });
  }

  for (const place of MAP_PLACES) {
    const details = [place.address, `Ville : ${place.city}`, `Horaires enregistrés : ${place.openingHours}`,
      ...(place.phone ? [`Téléphone enregistré : ${place.phone}`] : []), ...(place.note ? [place.note] : []),
      `Coordonnées : ${place.lat}, ${place.lng}`];
    results.push({ id: place.id, kind: 'place', title: `${place.name} (${place.city})`, summary: `${place.germanName} — ${place.category}`,
      details, notice: 'Lieu enregistré localement. Adresse, téléphone et horaires peuvent changer : vérifier avant déplacement.' });
  }

  for (const item of EMERGENCY_NUMBERS) {
    results.push({ id: `emergency-${item.number.replace(/\D/g, '')}`, kind: 'emergency', title: item.label,
      summary: `Numéro : ${item.number}. ${item.description}`, details: [`Gratuit indiqué : ${item.free ? 'oui' : 'non'}`],
      notice: 'En cas de danger immédiat, utilisez le numéro d’urgence approprié ; cette fiche est une aide locale.' });
  }

  for (const module of GERMAN_CURRICULUM) {
    const details = [
      `Niveau : ${module.level}. Situation : ${module.situation}`,
      `Grammaire : ${module.grammarFocus}`,
      ...module.vocabulary.map(v => `${v.article ? `${v.article} ` : ''}${v.de} = ${v.fr}. Exemple : ${v.exampleDe} / ${v.exampleFr}`),
      ...module.dialogue.map(d => `${d.speaker} : ${d.de} — ${d.fr}`),
      ...module.speakingPrompts.map(p => `${p.phraseDe} — ${p.phraseFr}. ${p.tip}`),
      ...module.quiz.map(q => `Exercice : ${q.question}. ${q.options.join(' / ')}. Explication : ${q.explanation}`),
    ];
    results.push({ id: module.id, kind: 'german_lesson', title: `Allemand ${module.level} — ${module.title}`,
      summary: `${module.theme}. ${module.situation}`, details, notice: 'Contenu pédagogique local du cursus ARIA.' });
  }
  return results;
}

const INDEX = buildIndex();

export function searchOfflineResources(query: string, limit = 5): OfflineSearchResult[] {
  const normalized = normalizeOfflineText(query);
  if (!normalized || normalized.length < 2) return [];
  const terms = termsFor(query);
  return INDEX.map(item => ({ ...item, score: scoreResource(query, terms, item.title, `${item.summary} ${item.details.join(' ')}`, item.keywords || []) }))
    .filter(item => item.score >= 6)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'fr'))
    .slice(0, Math.min(1, Math.max(1, limit)));
}
