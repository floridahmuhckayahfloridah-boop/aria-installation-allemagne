import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  MapPin, 
  FileSearch, 
  BookOpen, 
  Heart, 
  Clock, 
  ShieldAlert, 
  Volume2, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { UserProfile, AdminProcedure } from '../../types';
import { ActiveTab } from '../layout/BottomNavBar';
import { ADMINISTRATIVE_PROCEDURES } from '../../data/administrativeProcedures';

interface HomeDashboardProps {
  userProfile: UserProfile;
  completedProcedures: string[];
  onNavigate: (tab: ActiveTab) => void;
  onOpenAssistant: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  userProfile,
  completedProcedures,
  onNavigate,
  onOpenAssistant,
}) => {
  // Calculate dynamic time for Berlin (UTC+1) and Antananarivo (UTC+3)
  const [times, setTimes] = useState({ germany: '', madagascar: '', madaHour: 12 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const germanyTime = now.toLocaleTimeString('fr-FR', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
      });
      const madaTime = now.toLocaleTimeString('fr-FR', {
        timeZone: 'Indian/Antananarivo',
        hour: '2-digit',
        minute: '2-digit',
      });
      const madaHour = parseInt(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Indian/Antananarivo',
          hour: 'numeric',
          hour12: false,
        }),
        10
      );
      setTimes({ germany: germanyTime, madagascar: madaTime, madaHour });
    };
    update();
    const interval = setInterval(update, 15000);
    return () => clearInterval(interval);
  }, []);

  // Compute Anmeldung countdown (14 days from arrival)
  const arrivalDateObj = new Date(userProfile.arrivalDate);
  const deadlineDateObj = new Date(arrivalDateObj.getTime() + 14 * 24 * 60 * 60 * 1000);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isAnmeldungDone = completedProcedures.includes('anmeldung-buergeramt');

  // Completed percentage
  const totalRelevant = ADMINISTRATIVE_PROCEDURES.filter(p =>
    p.applicableStatuses.includes(userProfile.status)
  ).length;
  const completedCount = completedProcedures.length;
  const progressPercent = Math.min(100, Math.round((completedCount / (totalRelevant || 1)) * 100));

  // Audio TTS player
  const speakGerman = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const isGoodTimeToCallMada = times.madaHour >= 8 && times.madaHour <= 21;

  return (
    <div className="space-y-4 pb-20">
      {/* Visual Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#143627] via-[#1b4332] to-[#2d6a4f] text-white shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="/src/assets/images/aria_germany_arrival_1794139517824.jpg"
            alt="Arrivée en Allemagne"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
        <div className="relative p-5 z-10">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider bg-white/10 px-2.5 py-1 rounded-full backdrop-blur-sm">
              Installation sereine & autonome
            </span>
            <span className="text-xs text-emerald-200">
              Jour {Math.max(1, Math.floor((now.getTime() - arrivalDateObj.getTime()) / (1000 * 60 * 60 * 24)))}
            </span>
          </div>

          <h2 className="text-xl font-bold mt-2 text-white leading-tight">
            Manao ahoana, {userProfile.name} !
          </h2>
          <p className="text-xs text-emerald-100/90 mt-1 max-w-sm leading-relaxed">
            Bienvenue dans ton parcours en Allemagne. ARIA t'accompagne pas-à-pas dans tes démarches, tes documents et ta nouvelle vie.
          </p>

          {/* Quick Progress Bar */}
          <div className="mt-4 pt-3 border-t border-emerald-600/30">
            <div className="flex items-center justify-between text-xs font-medium text-emerald-200 mb-1.5">
              <span>Progression de tes démarches clés</span>
              <span className="font-bold text-white">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-emerald-950/60 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Alert / Anmeldung Priority Card */}
      {!isAnmeldungDone ? (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-700 dark:text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                  Démarche prioritaire n°1
                </span>
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200 bg-amber-200/60 dark:bg-amber-900/40 px-2 py-0.5 rounded-full">
                  {diffDays > 0 ? `Plus que ${diffDays} jours` : 'Délai dépassé !'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                Déclaration de domicile (Anmeldung)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                La loi fédérale exige d’enregistrer votre adresse en mairie dans les 14 jours. N'oubliez pas la Wohnungsgeberbestätigung signée par votre logeur.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold active:scale-95 transition flex items-center gap-1.5"
                >
                  <span>Voir la liste des pièces</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onNavigate('map')}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-50 transition flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Trouver le Bürgeramt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Anmeldung validée avec succès !
              </p>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Prochaine étape recommandée : ouvrir votre compte bancaire allemand (Girokonto).
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('admin')}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center"
          >
            Suivant <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Dual Timezone & Family Connection Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Décalage horaire & Liens familiaux
            </h3>
          </div>
          <button
            onClick={() => onNavigate('madagascar')}
            className="text-[11px] text-emerald-700 dark:text-emerald-400 hover:underline font-semibold"
          >
            Mes contacts pays →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Allemagne (Berlin)</span>
              <span className="text-[10px] text-slate-400">UTC+1</span>
            </div>
            <p className="text-xl font-black text-slate-800 dark:text-white tabular-nums mt-1">
              {times.germany || '12:00'}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">Ici chez toi</p>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-emerald-800 dark:text-emerald-300">Madagascar</span>
              <span className="text-[10px] text-emerald-600 font-semibold">+2 heures (UTC+3)</span>
            </div>
            <p className="text-xl font-black text-emerald-900 dark:text-emerald-100 tabular-nums mt-1">
              {times.madagascar || '14:00'}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isGoodTimeToCallMada ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300">
                {isGoodTimeToCallMada ? 'Bon moment pour appeler !' : 'Nuit à Madagascar'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Core Feature Grid */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-2.5">
          Fonctionnalités principales
        </h3>
        <div className="grid grid-cols-2 gap-2.5">
          {/* 1. Carte interactive */}
          <button
            onClick={() => onNavigate('map')}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 active:scale-95 transition shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center text-teal-700 dark:text-teal-300 mb-2 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Carte & Repères</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Mairies, gares, pharmacies de nuit, supermarchés & consulats.
            </p>
          </button>

          {/* 2. Assistant administratif */}
          <button
            onClick={() => onNavigate('admin')}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 active:scale-95 transition shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-300 mb-2 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Démarches Clés</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Anmeldung, banque, assurance santé, visa & pièges évités.
            </p>
          </button>

          {/* 3. Assistant documents */}
          <button
            onClick={() => onNavigate('documents')}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 active:scale-95 transition shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-700 dark:text-indigo-300 mb-2 group-hover:scale-105 transition-transform">
              <FileSearch className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Scanner & Traducteur</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Prends en photo un courrier allemand : explication et dates limites.
            </p>
          </button>

          {/* 4. Apprentissage allemand */}
          <button
            onClick={() => onNavigate('german')}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 active:scale-95 transition shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-2 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Allemand Quotidien</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Parcours A1-B2 : dialogues audio, vocabulaire et prononciation.
            </p>
          </button>

          {/* 5. Mes liens avec Madagascar */}
          <button
            onClick={() => onNavigate('madagascar')}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 active:scale-95 transition shadow-sm group"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-900/40 flex items-center justify-center text-rose-700 dark:text-rose-300 mb-2 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Liens Madagascar</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
              Contacts protégés, anniversaires, journal intime et souvenirs.
            </p>
          </button>

          {/* 6. Conseillère ARIA IA */}
          <button
            onClick={onOpenAssistant}
            className="flex flex-col text-left p-3.5 rounded-2xl bg-gradient-to-br from-[#143627] to-[#1b4332] text-white active:scale-95 transition shadow-md group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-emerald-300 mb-2 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-white">Conseillère ARIA</h4>
            <p className="text-[11px] text-emerald-100 mt-0.5 line-clamp-2">
              Pose toutes tes questions administratives et quotidiennes.
            </p>
          </button>
        </div>
      </div>

      {/* Daily German Phrase / Pronunciation Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Expression utile du jour
          </span>
          <button
            onClick={() => speakGerman('Entschuldigung, ich lerne noch Deutsch. Können Sie bitte etwas langsamer sprechen?')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 active:scale-95"
            title="Écouter la prononciation"
          >
            <Volume2 className="w-4 h-4" />
            <span>Écouter</span>
          </button>
        </div>
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          « Entschuldigung, ich lerne noch Deutsch. Können Sie bitte etwas langsamer sprechen? »
        </p>
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic">
          « Excusez-moi, j'apprends encore l'allemand. Pourriez-vous parler un peu plus lentement s'il vous plaît ? »
        </p>
      </div>

      {/* Emergency Fast Bar */}
      <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
              Besoin d'aide urgente en Allemagne ?
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-300">
              Urgences médicales <strong>112</strong> · Police <strong>110</strong> · Médecin de garde <strong>116 117</strong>
            </p>
          </div>
        </div>
        <a
          href="tel:112"
          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shrink-0 active:scale-95 transition"
        >
          Appel 112
        </a>
      </div>
    </div>
  );
};
