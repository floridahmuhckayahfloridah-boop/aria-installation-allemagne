import React, { useState } from 'react';
import { 
  BookOpen, 
  Volume2, 
  Mic, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  ChevronRight, 
  RotateCcw, 
  Sparkles,
  Play,
  Check
} from 'lucide-react';
import { GermanModule, UserProfile } from '../../types';
import { GERMAN_CURRICULUM } from '../../data/germanCurriculum';
import { StorageService } from '../../services/storage';

interface GermanLearningProps {
  userProfile: UserProfile;
}

export const GermanLearning: React.FC<GermanLearningProps> = ({ userProfile }) => {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>(userProfile.germanLevel || 'A1');
  const [activeModule, setActiveModule] = useState<GermanModule>(GERMAN_CURRICULUM[0]);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'vocabulary' | 'speaking' | 'quiz'>('dialogue');
  const [completedModules, setCompletedModules] = useState<string[]>(StorageService.getLearningCompletedModules());
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [isSpeakingListening, setIsSpeakingListening] = useState(false);
  const [spokenFeedback, setSpokenFeedback] = useState<string | null>(null);

  // Filter modules by level
  const levelModules = GERMAN_CURRICULUM.filter(m => m.level === selectedLevel);

  // German Web Speech Synthesis
  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 0.85; // Slightly slower for language learners
      window.speechSynthesis.speak(utterance);
    }
  };

  // Toggle module completed
  const handleToggleCompleted = (moduleId: string) => {
    const updated = StorageService.toggleLearningModule(moduleId);
    setCompletedModules(updated);
  };

  // Practice speaking with Speech Recognition
  const handleStartSpeaking = (targetPhrase: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('La reconnaissance vocale n’est pas supportée par ce navigateur. Écoutez le modèle audio avec le bouton haut-parleur.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setIsSpeakingListening(true);
    setSpokenFeedback(null);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsSpeakingListening(false);
      setSpokenFeedback(`Tu as prononcé : « ${transcript} » — Bravo pour l'effort ! Continue à t'entraîner.`);
    };

    recognition.onerror = () => {
      setIsSpeakingListening(false);
      setSpokenFeedback('Écoute audio disponible ci-dessus pour perfectionner ton accent.');
    };

    recognition.start();
  };

  // Evaluate quiz
  const handleAnswerSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // If all correct, automatically mark module as completed
    const allCorrect = activeModule.quiz.every((q, idx) => quizAnswers[idx] === q.correctIndex);
    if (allCorrect && !completedModules.includes(activeModule.id)) {
      handleToggleCompleted(activeModule.id);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#143627] to-[#1b4332] text-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
            Allemand pratique du quotidien
          </span>
          <span className="text-xs text-emerald-200">
            {completedModules.length} leçons terminées
          </span>
        </div>

        <h2 className="text-lg font-bold text-white mt-2 leading-tight">
          L'allemand pour la vraie vie en Allemagne
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Salutations en famille, supermarché, mairies, urgences et contrats : apprends les vraies phrases que tu utiliseras tous les jours.
        </p>

        {/* Level Selector Pills */}
        <div className="mt-3 grid grid-cols-4 gap-1.5 bg-black/20 p-1.5 rounded-2xl">
          {(['A1', 'A2', 'B1', 'B2'] as const).map(lvl => (
            <button
              key={lvl}
              onClick={() => {
                setSelectedLevel(lvl);
                const firstMod = GERMAN_CURRICULUM.find(m => m.level === lvl);
                if (firstMod) {
                  setActiveModule(firstMod);
                  setActiveTab('dialogue');
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }
              }}
              className={`py-1.5 rounded-xl text-xs font-bold transition ${
                selectedLevel === lvl
                  ? 'bg-white text-[#143627] shadow'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Niveau {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Selector Carousel */}
      <div className="space-y-1.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
          Modules du niveau {selectedLevel}
        </h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {levelModules.map(mod => {
            const isCompleted = completedModules.includes(mod.id);
            const isSelected = activeModule.id === mod.id;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setActiveModule(mod);
                  setActiveTab('dialogue');
                  setQuizSubmitted(false);
                  setQuizAnswers({});
                }}
                className={`p-3 rounded-2xl text-left border transition shrink-0 max-w-[240px] ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300">
                    Module {mod.moduleNumber}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  )}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {mod.title}
                </h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {mod.theme}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Studio */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        {/* Module Header */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">
              {activeModule.level} · Module {activeModule.moduleNumber}
            </span>
            <button
              onClick={() => handleToggleCompleted(activeModule.id)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-xl transition ${
                completedModules.includes(activeModule.id)
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{completedModules.includes(activeModule.id) ? 'Complété' : 'À valider'}</span>
            </button>
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1.5 leading-snug">
            {activeModule.title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
            📍 <strong>Situation réelle :</strong> {activeModule.situation}
          </p>
        </div>

        {/* Tab Controls (Dialogue, Vocabulaire, Prononciation, Quiz) */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          {[
            { id: 'dialogue', label: 'Dialogue' },
            { id: 'vocabulary', label: 'Vocabulaire' },
            { id: 'speaking', label: 'Prononciation' },
            { id: 'quiz', label: 'Quiz' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 rounded-xl text-center transition ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-900 text-[#143627] dark:text-emerald-400 shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: DIALOGUE */}
        {activeTab === 'dialogue' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Appuie sur le haut-parleur pour entendre la prononciation native</span>
              <button
                onClick={() => {
                  const fullText = activeModule.dialogue.map(d => d.de).join(' ');
                  playAudio(fullText);
                }}
                className="text-emerald-700 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Lire tout le dialogue</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeModule.dialogue.map((line, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-white">
                      {line.speaker}
                    </span>
                    <button
                      onClick={() => playAudio(line.de)}
                      className="p-1 rounded-full text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-950 transition active:scale-90"
                      title="Écouter en allemand"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
                    {line.de}
                  </p>
                  {line.phonetic && (
                    <p className="text-[11px] text-amber-800 dark:text-amber-400/90 font-mono">
                      🗣️ {line.phonetic}
                    </p>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    {line.fr}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: VOCABULARY */}
        {activeTab === 'vocabulary' && (
          <div className="space-y-2.5">
            <p className="text-xs text-slate-500">
              Vocabulaire essentiel avec genre (der, die, das) et phrase d'exemple en contexte.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeModule.vocabulary.map((vocab, vIdx) => (
                <div
                  key={vIdx}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {vocab.de}
                    </span>
                    <button
                      onClick={() => playAudio(vocab.de)}
                      className="p-1 text-emerald-700 hover:text-emerald-900"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {vocab.fr}
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 italic pt-1 border-t border-slate-100 dark:border-slate-700">
                    Ex: {vocab.exampleDe} ({vocab.exampleFr})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SPEAKING PRACTICE */}
        {activeTab === 'speaking' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">
              Répète ces phrases clés à voix haute pour vaincre l'hésitation à l'oral.
            </p>
            <div className="space-y-3">
              {activeModule.speakingPrompts.map((prompt, pIdx) => (
                <div
                  key={pIdx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      {prompt.phraseDe}
                    </h5>
                    <button
                      onClick={() => playAudio(prompt.phraseDe)}
                      className="p-1 text-emerald-700"
                      title="Écouter le modèle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                    {prompt.phraseFr}
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-xl">
                    💡 Astuce d'accent : {prompt.tip}
                  </p>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleStartSpeaking(prompt.phraseDe)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143627] text-white text-xs font-semibold active:scale-95 transition"
                    >
                      <Mic className="w-3.5 h-3.5 text-emerald-300" />
                      <span>{isSpeakingListening ? 'Écoute en cours...' : 'Tester ma prononciation'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {spokenFeedback && (
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-900 dark:text-emerald-200">
                {spokenFeedback}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QUIZ */}
        {activeTab === 'quiz' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {activeModule.quiz.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {qIdx + 1}. {q.question}
                  </h5>

                  <div className="space-y-1.5">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrect = q.correctIndex === optIdx;

                      let btnStyle = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200';
                      if (isSelected) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold';
                      }
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-600 text-white font-bold border-emerald-600';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-600 text-white font-bold border-rose-600';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleAnswerSelect(qIdx, optIdx)}
                          className={`w-full text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                      💡 <strong>Explication :</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < activeModule.quiz.length}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    Object.keys(quizAnswers).length < activeModule.quiz.length
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#143627] hover:bg-[#1b4332] text-white active:scale-95'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Vérifier mes réponses</span>
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="w-full py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer le quiz</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
