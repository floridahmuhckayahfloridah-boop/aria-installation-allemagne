import React, { useState } from 'react';
import { 
  X, 
  User, 
  Save, 
  Download, 
  Trash2, 
  HardDrive, 
  WifiOff, 
  Check, 
  ShieldCheck, 
  RotateCcw
} from 'lucide-react';
import { UserProfile, UserStatus } from '../../types';
import { GERMAN_CITIES, MAP_PLACES } from '../../data/germanCitiesPlaces';
import { StorageService } from '../../services/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
  isSimulatedOffline: boolean;
  onToggleSimulateOffline: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onUpdateProfile,
  isSimulatedOffline,
  onToggleSimulateOffline,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const storageUsage = StorageService.calculateStorageEstimate();

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateProfile(formData);
    onClose();
  };

  const handleExportBackup = () => {
    const fullBackup = {
      profile: StorageService.getProfile(),
      procedures: StorageService.getCompletedProcedures(),
      savedDocs: StorageService.getSavedDocuments(),
      contacts: StorageService.getContacts(),
      events: StorageService.getEvents(),
      memories: StorageService.getMemories(),
      downloadedPacks: StorageService.getDownloadedPacks(),
      exportDate: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(fullBackup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARIA_Sauvegarde_Locale_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const handleResetData = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser toutes les données locales d’ARIA ?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-[#143627] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-300" />
            <h3 className="text-sm font-bold text-white">Mon profil & Données locales</h3>
          </div>
          <button onClick={onClose} className="p-1 text-emerald-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 overflow-y-auto text-xs text-slate-700 dark:text-slate-300">
          {/* User Profile Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Profil d'installation
            </h4>

            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">Prénom / Nom</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Statut en Allemagne</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="au_pair">Au Pair</option>
                  <option value="fsj_bfd">FSJ / BFD (Volontaire)</option>
                  <option value="ausbildung">Ausbildung (Apprenti)</option>
                  <option value="studium">Études Universitaires</option>
                  <option value="autre">Autre statut</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Ville de résidence</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  {GERMAN_CITIES.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Date d'arrivée</label>
                <input
                  type="date"
                  value={formData.arrivalDate}
                  onChange={(e) => setFormData({ ...formData, arrivalDate: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 block mb-0.5">Niveau d'allemand</label>
                <select
                  value={formData.germanLevel}
                  onChange={(e) => setFormData({ ...formData, germanLevel: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="A1">A1 — Débutant</option>
                  <option value="A2">A2 — Élémentaire</option>
                  <option value="B1">B1 — Intermédiaire</option>
                  <option value="B2">B2 — Avancé</option>
                </select>
              </div>
            </div>
          </div>

          {/* Offline Test Mode Switch */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <WifiOff className="w-4 h-4 text-amber-600" />
                  <span>Simuler le mode hors-ligne</span>
                </h5>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Permet de tester l’autonomie de l'application sans réseau.
                </p>
              </div>
              <button
                onClick={onToggleSimulateOffline}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${
                  isSimulatedOffline ? 'bg-amber-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    isSimulatedOffline ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Local place data: no simulated map download */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-emerald-600" />
              <span>Repères de lieux intégrés</span>
            </h4>
            <div className="space-y-1.5">
              {GERMAN_CITIES.map(city => {
                const placeCount = MAP_PLACES.filter(place =>
                  place.city.toLowerCase().includes(city.name.toLowerCase().split(' ')[0])
                ).length;
                return (
                  <div
                    key={city.id}
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <span className="font-bold text-xs text-slate-900 dark:text-white">
                      {city.name}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300">
                      {placeCount} lieu(x) référencé(s)
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">
              Les fiches de lieux présentes dans l’application restent consultables hors ligne. Le fond cartographique et les itinéraires nécessitent une connexion Internet ; aucun téléchargement de carte hors ligne n’est encore disponible.
            </p>
          </div>

          {/* Privacy & Storage Guarantee */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Souveraineté des données personnelles</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Vos contacts malgaches, documents scannés et notes de journal sont conservés <strong>exclusivement sur la mémoire de ce téléphone</strong> (espace utilisé : {storageUsage}). Aucune donnée intime n'est revendue ni partagée.
            </p>
          </div>

          {/* Data Backup & Reset Buttons */}
          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2">
            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Exporter ma sauvegarde locale (JSON)</span>
            </button>
            <button
              onClick={handleResetData}
              className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-[11px] font-medium transition"
            >
              Réinitialiser l'application
            </button>
          </div>
        </div>

        {/* Modal Sticky Bottom Action */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-400 font-medium"
          >
            Fermer
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#143627] hover:bg-[#1b4332] text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Enregistrer mon profil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
