import { UserProfile, DocumentAnalysisResult, MadagascarContact, MadagascarEvent, MemoryNote } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'aria_user_profile_v1',
  COMPLETED_PROCEDURES: 'aria_completed_procedures_v1',
  DOCUMENTS: 'aria_saved_documents_v1',
  CONTACTS: 'aria_madagascar_contacts_v1',
  EVENTS: 'aria_madagascar_events_v1',
  MEMORIES: 'aria_madagascar_memories_v1',
  OFFLINE_PACKS: 'aria_downloaded_packs_v1',
  LEARNING_PROGRESS: 'aria_learning_progress_v1',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Miora',
  status: 'au_pair',
  city: 'Berlin',
  postalCode: '10178',
  arrivalDate: '2026-10-15',
  germanLevel: 'A1',
  hasAnmeldungDone: false,
  hasBankDone: false,
  hasInsuranceDone: true,
  offlinePacks: ['berlin'],
};

export const INITIAL_CONTACTS: MadagascarContact[] = [
  {
    id: 'c1',
    name: 'Maman & Papa',
    relationship: 'Parents',
    phone: '+261 34 12 345 67',
    whatsappNumber: '+261341234567',
    city: 'Antananarivo (Itasy)',
    notes: 'Appeler de préférence le samedi après-midi (décalage horaire UTC+3).'
  },
  {
    id: 'c2',
    name: 'Tonton Heri',
    relationship: 'Parrain / Référant',
    phone: '+261 32 98 765 43',
    whatsappNumber: '+261329876543',
    city: 'Toamasina',
    notes: 'Garde mes papiers d’état civil malgaches au pays.'
  }
];

export const INITIAL_EVENTS: MadagascarEvent[] = [
  {
    id: 'e1',
    title: 'Anniversaire de Maman',
    date: '2026-11-24',
    isAnnualBirthday: true,
    notes: 'Envoyer une carte ou organiser un appel vidéo WhatsApp.'
  },
  {
    id: 'e2',
    title: 'Fête de l’Indépendance de Madagascar',
    date: '2027-06-26',
    isAnnualBirthday: true,
    notes: 'Célébrer avec la communauté malagasy en Allemagne (Asso Malagasy Berlin).'
  }
];

export const INITIAL_MEMORIES: MemoryNote[] = [
  {
    id: 'm1',
    title: 'Premier pas à Berlin et premier contact',
    content: 'Je suis bien arrivée ! L’air est frais mais la famille d’accueil m’a préparé une tasse de thé chaud. Les rues sont calmes et très bien organisées. Maman me manque un peu, mais je me sens prête et courageuse.',
    createdAt: '2026-10-16T18:30:00Z',
    moodTag: 'serene'
  }
];

// Helper safe storage getters & setters
export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  },

  getCompletedProcedures(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_PROCEDURES);
      return data ? JSON.parse(data) : ['krankenversicherung'];
    } catch {
      return [];
    }
  },

  toggleProcedureCompleted(id: string): string[] {
    const list = this.getCompletedProcedures();
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    try {
      localStorage.setItem(STORAGE_KEYS.COMPLETED_PROCEDURES, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getSavedDocuments(): DocumentAnalysisResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveDocument(doc: DocumentAnalysisResult): DocumentAnalysisResult[] {
    const docs = this.getSavedDocuments().filter(d => d.id !== doc.id);
    const updated = [doc, ...docs];
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  deleteDocument(id: string): DocumentAnalysisResult[] {
    const updated = this.getSavedDocuments().filter(d => d.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getContacts(): MadagascarContact[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  },

  saveContact(contact: MadagascarContact): MadagascarContact[] {
    const list = this.getContacts().filter(c => c.id !== contact.id);
    const updated = [...list, contact];
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  deleteContact(id: string): MadagascarContact[] {
    const updated = this.getContacts().filter(c => c.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getEvents(): MadagascarEvent[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return data ? JSON.parse(data) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  },

  saveEvent(event: MadagascarEvent): MadagascarEvent[] {
    const list = this.getEvents().filter(e => e.id !== event.id);
    const updated = [...list, event];
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  deleteEvent(id: string): MadagascarEvent[] {
    const updated = this.getEvents().filter(e => e.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getMemories(): MemoryNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : INITIAL_MEMORIES;
    } catch {
      return INITIAL_MEMORIES;
    }
  },

  saveMemory(note: MemoryNote): MemoryNote[] {
    const list = this.getMemories().filter(m => m.id !== note.id);
    const updated = [note, ...list];
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  deleteMemory(id: string): MemoryNote[] {
    const updated = this.getMemories().filter(m => m.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getDownloadedPacks(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_PACKS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleOfflinePack(cityId: string): string[] {
    const list = this.getDownloadedPacks();
    const updated = list.includes(cityId) ? list.filter(c => c !== cityId) : [...list, cityId];
    try {
      localStorage.setItem(STORAGE_KEYS.OFFLINE_PACKS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  getLearningCompletedModules(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEARNING_PROGRESS);
      return data ? JSON.parse(data) : ['a1-mod-1'];
    } catch {
      return ['a1-mod-1'];
    }
  },

  toggleLearningModule(id: string): string[] {
    const list = this.getLearningCompletedModules();
    const updated = list.includes(id) ? list.filter(i => i !== id) : [...list, id];
    try {
      localStorage.setItem(STORAGE_KEYS.LEARNING_PROGRESS, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return updated;
  },

  calculateStorageEstimate(): string {
    let totalChars = 0;
    for (const key in localStorage) {
      if (key.startsWith('aria_')) {
        totalChars += (localStorage.getItem(key) || '').length;
      }
    }
    const kb = Math.round((totalChars * 2) / 1024);
    return `${kb} Ko`;
  }
};
