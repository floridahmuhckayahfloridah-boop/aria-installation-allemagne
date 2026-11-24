import React, { useState } from 'react';
import { 
  Heart, 
  Users, 
  Calendar, 
  BookHeart, 
  Phone, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Clock, 
  Smile, 
  Globe2, 
  ExternalLink,
  MapPin,
  Sparkles
} from 'lucide-react';
import { MadagascarContact, MadagascarEvent, MemoryNote } from '../../types';
import { StorageService } from '../../services/storage';

export const MadagascarVault: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'contacts' | 'events' | 'memories' | 'consulat'>('contacts');
  
  // Local state persisted in StorageService
  const [contacts, setContacts] = useState<MadagascarContact[]>(StorageService.getContacts());
  const [events, setEvents] = useState<MadagascarEvent[]>(StorageService.getEvents());
  const [memories, setMemories] = useState<MemoryNote[]>(StorageService.getMemories());

  // Form states for adding items
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relationship: 'Famille', phone: '+261 ', city: 'Antananarivo', notes: '' });

  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', isAnnualBirthday: true, notes: '' });

  const [showAddMemory, setShowAddMemory] = useState(false);
  const [newMemory, setNewMemory] = useState<{ title: string; content: string; moodTag: MemoryNote['moodTag'] }>({
    title: '',
    content: '',
    moodTag: 'serene',
  });

  // Calculate live Madagascar Time (UTC+3)
  const now = new Date();
  const madaTimeString = now.toLocaleTimeString('fr-FR', {
    timeZone: 'Indian/Antananarivo',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Contact Handlers
  const handleSaveContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      alert('Veuillez renseigner au moins le nom et le numéro de téléphone.');
      return;
    }
    const cleanWhatsApp = newContact.phone.replace(/[^0-9]/g, '');
    const contact: MadagascarContact = {
      id: 'c_' + Date.now(),
      name: newContact.name.trim(),
      relationship: newContact.relationship.trim(),
      phone: newContact.phone.trim(),
      whatsappNumber: cleanWhatsApp,
      city: newContact.city.trim(),
      notes: newContact.notes.trim(),
    };
    const updated = StorageService.saveContact(contact);
    setContacts(updated);
    setNewContact({ name: '', relationship: 'Famille', phone: '+261 ', city: 'Antananarivo', notes: '' });
    setShowAddContact(false);
  };

  const handleDeleteContact = (id: string) => {
    const updated = StorageService.deleteContact(id);
    setContacts(updated);
  };

  // Event Handlers
  const handleSaveEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) {
      alert('Veuillez renseigner un titre et une date.');
      return;
    }
    const event: MadagascarEvent = {
      id: 'e_' + Date.now(),
      title: newEvent.title.trim(),
      date: newEvent.date,
      isAnnualBirthday: newEvent.isAnnualBirthday,
      notes: newEvent.notes.trim(),
    };
    const updated = StorageService.saveEvent(event);
    setEvents(updated);
    setNewEvent({ title: '', date: '', isAnnualBirthday: true, notes: '' });
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = StorageService.deleteEvent(id);
    setEvents(updated);
  };

  // Memory Handlers
  const handleSaveMemory = () => {
    if (!newMemory.title.trim() || !newMemory.content.trim()) {
      alert('Veuillez renseigner un titre et quelques lignes pour votre souvenir.');
      return;
    }
    const memory: MemoryNote = {
      id: 'm_' + Date.now(),
      title: newMemory.title.trim(),
      content: newMemory.content.trim(),
      createdAt: new Date().toISOString(),
      moodTag: newMemory.moodTag,
    };
    const updated = StorageService.saveMemory(memory);
    setMemories(updated);
    setNewMemory({ title: '', content: '', moodTag: 'serene' });
    setShowAddMemory(false);
  };

  const handleDeleteMemory = (id: string) => {
    const updated = StorageService.deleteMemory(id);
    setMemories(updated);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#143627] via-[#1b4332] to-[#2d6a4f] text-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
            Espace personnel & affectif
          </span>
          <div className="flex items-center gap-1.5 text-xs text-emerald-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Madagascar : {madaTimeString} (UTC+3)</span>
          </div>
        </div>

        <h2 className="text-lg font-bold text-white mt-2 leading-tight">
          Mes liens avec Madagascar
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Garde le lien précieux avec ta famille, tes proches et tes racines malgaches. Tes données restent 100% privées et stockées sur ton téléphone.
        </p>

        {/* 4 Tabs Selector */}
        <div className="mt-3 grid grid-cols-4 gap-1 bg-black/20 p-1 rounded-2xl text-xs font-semibold">
          {[
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'events', label: 'Rappels', icon: Calendar },
            { id: 'memories', label: 'Journal', icon: BookHeart },
            { id: 'consulat', label: 'Consulat', icon: Globe2 },
          ].map(tab => {
            const Icon = tab.icon;
            const isSelected = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-1.5 rounded-xl flex items-center justify-center gap-1 transition ${
                  isSelected
                    ? 'bg-white text-[#143627] font-bold shadow'
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 1: CONTACTS AU PAYS */}
      {activeSection === 'contacts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Contacts précieux au pays ({contacts.length})
            </h3>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter un proche</span>
            </button>
          </div>

          {/* Add Contact Modal / Box */}
          {showAddContact && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 shadow-md space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Ajouter un contact à Madagascar
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Nom / Prénom</label>
                  <input
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Ex: Maman, Tonton Heri..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Lien de parenté</label>
                  <input
                    type="text"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="Ex: Mère, Frère, Parrain..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Numéro WhatsApp / Téléphone</label>
                  <input
                    type="tel"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+261 34 ..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Ville à Madagascar</label>
                  <input
                    type="text"
                    value={newContact.city}
                    onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
                    placeholder="Ex: Antananarivo, Tamatave..."
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddContact(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveContact}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#143627] hover:bg-[#1b4332] rounded-xl active:scale-95 transition"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          {/* Contacts List */}
          <div className="space-y-2">
            {contacts.map(contact => (
              <div
                key={contact.id}
                className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold text-sm flex items-center justify-center shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {contact.name}
                      </h4>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">
                        {contact.relationship}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{contact.city}</span>
                      <span>·</span>
                      <span className="font-mono">{contact.phone}</span>
                    </p>
                    {contact.notes && (
                      <p className="text-[10px] text-slate-400 italic mt-0.5">
                        {contact.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {contact.whatsappNumber && (
                    <a
                      href={`https://wa.me/${contact.whatsappNumber.replace('+', '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center hover:bg-emerald-100 active:scale-95 transition"
                      title="Écrire sur WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                  )}
                  <a
                    href={`tel:${contact.phone}`}
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition"
                    title="Appeler par téléphone"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: RAPPELS & ANNIVERSAIRES */}
      {activeSection === 'events' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Anniversaires & Dates à ne pas oublier ({events.length})
            </h3>
            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nouveau rappel</span>
            </button>
          </div>

          {showAddEvent && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 shadow-md space-y-3 text-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Ajouter une date ou un anniversaire
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Titre</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Ex: Anniversaire de Maman"
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:border-slate-700"
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setShowAddEvent(false)} className="text-xs text-slate-500">
                  Annuler
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#143627] rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {events.map(ev => {
              const eventDate = new Date(ev.date);
              const formattedDate = eventDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
              });

              return (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 flex flex-col items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 mb-0.5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {ev.title}
                      </h4>
                      <p className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold mt-0.5">
                        {formattedDate} {ev.isAnnualBirthday && '(Chaque année)'}
                      </p>
                      {ev.notes && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{ev.notes}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 3: JOURNAL INTIME & SOUVENIRS */}
      {activeSection === 'memories' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Journal de bord & Pensées ({memories.length})
            </h3>
            <button
              onClick={() => setShowAddMemory(!showAddMemory)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-xl active:scale-95 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Écrire une note</span>
            </button>
          </div>

          {showAddMemory && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 shadow-md space-y-3 text-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Nouveau souvenir ou sentiment
              </h4>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Titre</label>
                <input
                  type="text"
                  value={newMemory.title}
                  onChange={(e) => setNewMemory({ ...newMemory, title: e.target.value })}
                  placeholder="Ex: Première balade sous la neige..."
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Mes pensées</label>
                <textarea
                  value={newMemory.content}
                  onChange={(e) => setNewMemory({ ...newMemory, content: e.target.value })}
                  rows={3}
                  placeholder="Écris librement ce que tu ressens, tes victoires du jour, tes doutes..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button onClick={() => setShowAddMemory(false)} className="text-xs text-slate-500">
                  Annuler
                </button>
                <button
                  onClick={handleSaveMemory}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#143627] rounded-xl"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2.5">
            {memories.map(mem => (
              <div
                key={mem.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {mem.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400">
                      {new Date(mem.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(mem.id)}
                      className="p-1 text-slate-300 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl">
                  {mem.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: AMBASSADE & CONSULAT DE MADAGASCAR */}
      {activeSection === 'consulat' && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                🇲🇬
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Ambassade de Madagascar en Allemagne
                </h4>
                <p className="text-[11px] text-slate-500">Représentation diplomatique officielle</p>
              </div>
            </div>

            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p>
                📍 <strong>Adresse physique :</strong> Seepromenade 92, 14612 Falkensee (accessible en train régional RE2 / RE6 depuis Berlin Hauptbahnhof).
              </p>
              <p>
                📞 <strong>Téléphone consulaire :</strong>{' '}
                <a href="tel:+49332223140" className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline">
                  +49 3322 23140
                </a>
              </p>
              <p>
                ✉️ <strong>Courriel :</strong> info@botschaft-madagaskar.de
              </p>
              <p>
                🕒 <strong>Horaires du guichet :</strong> Lundi au Vendredi, 09h00 à 12h30 et 13h30 à 16h00.
              </p>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200/60 text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed">
              💡 <strong>Conseil ARIA :</strong> Pour le renouvellement de votre passeport biométrique malgache, prenez rendez-vous au moins 3 mois à l'avance. Gardez toujours une copie de votre acte de naissance certifié conforme avec vous.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
