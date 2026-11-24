import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  ShieldCheck, 
  ChevronRight, 
  Filter, 
  X,
  BookOpen,
  HelpCircle,
  Calendar
} from 'lucide-react';
import { AdminProcedure, UserProfile, ProcedureCategory } from '../../types';
import { ADMINISTRATIVE_PROCEDURES } from '../../data/administrativeProcedures';
import { StorageService } from '../../services/storage';

interface AdministrativeAssistantProps {
  userProfile: UserProfile;
  completedProcedures: string[];
  onToggleComplete: (id: string) => void;
  onOpenAssistant: (initialTopic?: string) => void;
}

export const AdministrativeAssistant: React.FC<AdministrativeAssistantProps> = ({
  userProfile,
  completedProcedures,
  onToggleComplete,
  onOpenAssistant,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProcedureCategory | 'all'>('all');
  const [onlyMyStatus, setOnlyMyStatus] = useState(true);
  const [activeProcedure, setActiveProcedure] = useState<AdminProcedure | null>(null);

  const filteredProcedures = ADMINISTRATIVE_PROCEDURES.filter(proc => {
    const matchesStatus = !onlyMyStatus || proc.applicableStatuses.includes(userProfile.status);
    const matchesCategory = selectedCategory === 'all' || proc.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const completedCount = filteredProcedures.filter(p => completedProcedures.includes(p.id)).length;
  const progressPercent = Math.round((completedCount / (filteredProcedures.length || 1)) * 100);

  return (
    <div className="space-y-4 pb-24">
      {/* Header Overview Card */}
      <div className="bg-gradient-to-br from-[#143627] to-[#1b4332] text-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
            Guide administratif officiel · Daté Novembre 2026
          </span>
          <span className="text-xs text-emerald-200">
            {completedCount} sur {filteredProcedures.length} terminées
          </span>
        </div>

        <h2 className="text-lg font-bold text-white mt-2 leading-tight">
          Feuille de route de votre installation
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Toutes les formalités indispensables en Allemagne, vérifiées selon le droit fédéral avec la liste exacte des pièces justificatives.
        </p>

        {/* Global Progress Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-600/30">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-200 mb-1.5">
            <span>Progression globale</span>
            <span className="text-white font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-emerald-950/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter Segmented Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Catégories
          </h3>
          <button
            onClick={() => setOnlyMyStatus(!onlyMyStatus)}
            className={`text-xs font-semibold px-2 py-0.5 rounded-md transition ${
              onlyMyStatus
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {onlyMyStatus ? 'Filtre : Mon profil uniquement' : 'Afficher toutes les démarches'}
          </button>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {[
            { id: 'all', label: 'Toutes' },
            { id: 'priority_arrival', label: '1. Arrivée urgente' },
            { id: 'banking_money', label: '2. Compte bancaire' },
            { id: 'health_insurance', label: '3. Santé & Assurance' },
            { id: 'housing_living', label: '4. Logement & Taxe' },
            { id: 'legal_stay', label: '5. Titre de séjour' },
            { id: 'daily_essentials', label: '6. Droits & Vie' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-semibold shrink-0 transition active:scale-95 ${
                selectedCategory === cat.id
                  ? 'bg-[#143627] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Procedures List Cards */}
      <div className="space-y-2.5">
        {filteredProcedures.map(proc => {
          const isDone = completedProcedures.includes(proc.id);

          return (
            <div
              key={proc.id}
              className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border transition shadow-sm ${
                isDone
                  ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <button
                  onClick={() => onToggleComplete(proc.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 active:scale-90 transition shrink-0"
                  aria-label={isDone ? 'Marquer comme non fait' : 'Marquer comme validé'}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="flex-1 cursor-pointer" onClick={() => setActiveProcedure(proc)}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100/60 dark:bg-emerald-900/30 px-2 py-0.5 rounded">
                      {proc.legalBasis}
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{proc.legalDeadline}</span>
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold mt-1 text-slate-900 dark:text-white leading-snug ${
                      isDone ? 'line-through text-slate-400 dark:text-slate-500' : ''
                    }`}
                  >
                    {proc.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic">
                    {proc.germanTitle}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2 leading-relaxed">
                    {proc.shortSummary}
                  </p>
                </div>

                <button
                  onClick={() => setActiveProcedure(proc)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shrink-0 self-center"
                  aria-label="Voir le détail"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Card Footer Info */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">
                  Coût : <strong className="text-slate-700 dark:text-slate-300">{proc.financialCost}</strong>
                </span>
                <button
                  onClick={() => setActiveProcedure(proc)}
                  className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Étapes & Pièces</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Procedure Modal / Bottom Sheet */}
      {activeProcedure && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg max-h-[90vh] bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto flex flex-col">
            {/* Sheet Handle */}
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 shrink-0 sm:hidden" />

            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-3 sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
                    {activeProcedure.legalBasis}
                  </span>
                  <span className="text-[10px] text-slate-400">·</span>
                  <span className="text-[10px] text-slate-500">
                    Vérifié : {activeProcedure.verifiedDate}
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                  {activeProcedure.title}
                </h2>
                <p className="text-xs text-slate-500 italic mt-0.5">
                  {activeProcedure.germanTitle}
                </p>
              </div>

              <button
                onClick={() => setActiveProcedure(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5 text-xs text-slate-700 dark:text-slate-300 overflow-y-auto">
              {/* Timing & Cost Banner */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Délai légal strict
                  </span>
                  <span className="font-bold text-amber-800 dark:text-amber-300 mt-0.5 block">
                    {activeProcedure.legalDeadline}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Coût administratif
                  </span>
                  <span className="font-bold text-slate-800 dark:text-white mt-0.5 block">
                    {activeProcedure.financialCost}
                  </span>
                </div>
              </div>

              {/* Required Documents Checklist */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Dossier & Pièces justificatives obligatoires</span>
                </h4>
                <div className="space-y-1.5 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  {activeProcedure.requiredDocuments.map((doc, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span className="text-xs leading-relaxed">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2.5">
                  Étapes à suivre pas-à-pas
                </h4>
                <div className="space-y-3">
                  {activeProcedure.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#143627] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {step.stepNumber}
                        </span>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white">
                          {step.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                        {step.description}
                      </p>
                      {step.tips && (
                        <div className="ml-8 mt-1 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-[11px] border border-amber-200/60 leading-relaxed">
                          💡 <strong>Conseil ARIA :</strong> {step.tips}
                        </div>
                      )}
                      {step.germanTerms.length > 0 && (
                        <div className="ml-8 mt-1 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] text-slate-400">Termes allemands :</span>
                          {step.germanTerms.map((term, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-1.5 py-0.5 rounded"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pitfalls to Avoid */}
              {activeProcedure.commonPitfalls.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-1.5">
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Pièges fréquents à éviter absolument</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-rose-800 dark:text-rose-300">
                    {activeProcedure.commonPitfalls.map((pitfall, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5 leading-relaxed">
                        <span>•</span>
                        <span>{pitfall}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Official Source Link */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Source officielle : <strong>{activeProcedure.officialSourceName}</strong></span>
                <a
                  href={activeProcedure.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Consulter le site officiel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Modal Sticky Bottom Action */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <button
                onClick={() => {
                  onToggleComplete(activeProcedure.id);
                  setActiveProcedure(null);
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition ${
                  completedProcedures.includes(activeProcedure.id)
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                    : 'bg-[#143627] text-white hover:bg-[#1b4332]'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {completedProcedures.includes(activeProcedure.id)
                    ? 'Marquer comme non finalisé'
                    : 'Valider cette démarche (Terminée)'}
                </span>
              </button>
              <button
                onClick={() => {
                  const title = activeProcedure.title;
                  setActiveProcedure(null);
                  onOpenAssistant(`J'ai une question sur la démarche "${title}". Peux-tu m'expliquer ?`);
                }}
                className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 active:scale-95 transition flex items-center gap-1"
                title="Poser une question à ARIA"
              >
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Aide IA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
