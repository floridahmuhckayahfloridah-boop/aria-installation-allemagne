export type UserStatus = 'au_pair' | 'fsj_bfd' | 'ausbildung' | 'studium' | 'autre';

export interface UserProfile {
  name: string;
  status: UserStatus;
  city: string;
  postalCode?: string;
  arrivalDate: string; // YYYY-MM-DD
  germanLevel: 'A1' | 'A2' | 'B1' | 'B2';
  hasAnmeldungDone: boolean;
  hasBankDone: boolean;
  hasInsuranceDone: boolean;
  offlinePacks: string[]; // List of downloaded city IDs
}

export type ProcedureCategory = 
  | 'priority_arrival' 
  | 'legal_stay' 
  | 'banking_money' 
  | 'health_insurance' 
  | 'housing_living' 
  | 'daily_essentials';

export interface AdminStep {
  stepNumber: number;
  title: string;
  description: string;
  germanTerms: string[];
  tips?: string;
}

export interface AdminProcedure {
  id: string;
  title: string;
  germanTitle: string;
  category: ProcedureCategory;
  applicableStatuses: UserStatus[];
  legalDeadline: string; // e.g. "14 jours après emménagement"
  legalBasis: string; // e.g. "§ 17 BMG (Bundesmeldegesetz)"
  verifiedDate: string; // e.g. "Novembre 2026"
  officialSourceUrl: string;
  officialSourceName: string;
  importance: 'critical' | 'high' | 'recommended';
  shortSummary: string;
  requiredDocuments: string[];
  steps: AdminStep[];
  commonPitfalls: string[];
  financialCost: string; // e.g. "Gratuit" or "18,36 € / mois"
  completed?: boolean;
}

export type PlaceCategory = 
  | 'administration' 
  | 'station' 
  | 'pharmacy' 
  | 'hospital' 
  | 'supermarket' 
  | 'embassy' 
  | 'afro_shop' 
  | 'emergency';

export interface MapPlace {
  id: string;
  name: string;
  germanName: string;
  category: PlaceCategory;
  city: string;
  lat: number;
  lng: number;
  address: string;
  openingHours: string;
  phone?: string;
  note?: string;
  offlineAvailable: boolean;
}

export interface DocumentAnalysisResult {
  id: string;
  fileName: string;
  analyzedAt: string;
  isOfflineFallback?: boolean;
  documentType: string;
  issuer: string;
  urgencyLevel: 'urgent' | 'attention' | 'normal' | 'information';
  summary: string;
  extractedTextSample?: string;
  importantDates: { date: string; label: string }[];
  obligations: string[];
  financialImpact: string;
  actionSteps: string[];
  pitfallsToAvoid: string;
  keyVocabulary: { german: string; french: string }[];
  officialSource?: string;
}

export interface DialogueLine {
  speaker: string;
  avatarColor?: string;
  de: string;
  fr: string;
  phonetic?: string;
}

export interface VocabWord {
  de: string;
  article?: 'der' | 'die' | 'das' | '';
  fr: string;
  exampleDe: string;
  exampleFr: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GermanModule {
  id: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  moduleNumber: number;
  title: string;
  theme: string;
  situation: string;
  grammarFocus: string;
  dialogue: DialogueLine[];
  vocabulary: VocabWord[];
  speakingPrompts: { phraseDe: string; phraseFr: string; tip: string }[];
  quiz: QuizQuestion[];
}

export interface MadagascarContact {
  id: string;
  name: string;
  relationship: string; // "Maman", "Frère", "Parrain", etc.
  phone: string;
  whatsappNumber?: string;
  city: string; // e.g. "Antananarivo", "Toamasina", "Fianarantsoa"
  notes?: string;
}

export interface MadagascarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  contactId?: string;
  isAnnualBirthday: boolean;
  notes?: string;
}

export interface MemoryNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  moodTag: 'serene' | 'homesick' | 'proud' | 'curious' | 'joyful';
}
