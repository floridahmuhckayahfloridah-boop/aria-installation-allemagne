import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Save, 
  ChevronRight, 
  WifiOff, 
  ArrowRight,
  ShieldAlert,
  Archive,
  Copy,
  Check
} from 'lucide-react';
import { DocumentAnalysisResult, UserProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { API_BASE_URL } from '../../services/api';

interface DocumentAssistantProps {
  isOnline: boolean;
  userProfile: UserProfile;
}

// Sample official German documents for quick one-click testing
const SAMPLE_DOCUMENTS = [
  {
    id: 'sample-rundfunk',
    name: 'Lettre ARD ZDF Beitragsservice (Redevance)',
    text: `ARD ZDF Deutschlandradio Beitragsservice
50656 Köln
Aktenzeichen: 492 819 028
Datum: 10.11.2026

Sehr geehrte Damen und Herren,
Sie sind laut Bundesmeldegesetz für die Wohnung in der Karl-Marx-Allee 31 in Berlin gemeldet.
Für jede Wohnung ist grundsätzlich ein gesetzlicher Rundfunkbeitrag von monatlich 18,36 Euro zu zahlen.

Bitte teilen Sie uns innerhalb von vier Wochen (Frist: 08.12.2026) mit:
1. Ob Sie die Wohnung selbst anmelden und den Beitrag zahlen.
2. Oder ob der Beitrag für diese Wohnung bereits von einer anderen Person (Gastfamilie, Mitbewohner) gezahlt wird. Nennen Sie uns in diesem Fall bitte die 9-stellige Beitragsnummer.

Wichtiger Hinweis: Bei Nichtbeantwortung droht ein Festsetzungsbescheid mit Säumniszuschlag.`
  },
  {
    id: 'sample-anmeldung',
    name: 'Attestation Meldebestätigung (Mairie)',
    text: `Bezirksamt Mitte von Berlin - Bürgeramt
Amtliche Meldebestätigung nach § 24 Bundesmeldegesetz (BMG)
Datum der Ausstellung: 02.11.2026

Familienname: Rasoamanana
Vorname: Miora
Geburtsdatum: 14.05.2003
Staatsangehörigkeit: madagassisch

Neue Wohnung: Karl-Marx-Allee 31, 10178 Berlin
Einzugsdatum: 20.10.2026
Wohnungsgeber: Familie Schmidt

Hinweis zur Steuer-ID: Die steuerliche Identifikationsnummer wird Ihnen durch das Bundeszentralamt für Steuern (BZSt) automatisch per gesondertem Brief mitgeteilt.`
  },
  {
    id: 'sample-aupair',
    name: 'Contrat Au-Pair (Convention type)',
    text: `Au-Pair-Vertrag nach den Richtlinien der Bundesagentur für Arbeit
Zwischen der Gastfamilie Schmidt und dem Au-Pair Miora

§ 3 Taschengeld und Verpflegung
Das Au-Pair erhält von der Gastfamilie ein monatliches Taschengeld von 280,00 Euro netto, zahlbar am 1. eines jeden Monats auf das deutsche Girokonto des Au-Pairs. Die Gastfamilie übernimmt die Kosten für Unterkunft und Verpflegung.

§ 4 Sprachkurs
Die Gastfamilie verpflichtet sich, einen monatlichen Zuschuss von 70,00 Euro zum Besuch eines Deutschkurses zu zahlen.

§ 5 Arbeitszeit
Die Aufgaben (Kinderbetreuung und leichte Mithilfe im Haushalt) dürfen 6 Stunden täglich und 30 Stunden wöchentlich nicht überschreiten. Dem Au-Pair steht mindestens 1,5 zusammenhängende freie Tage pro Woche zu.`
  }
];

export const DocumentAssistant: React.FC<DocumentAssistantProps> = ({ isOnline, userProfile }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [textInput, setTextInput] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [savedDocs, setSavedDocs] = useState<DocumentAnalysisResult[]>(StorageService.getSavedDocuments());
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');
  const [copiedVocab, setCopiedVocab] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload from camera or gallery
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setTextInput('');
    };
    reader.readAsDataURL(file);
  };

  // Trigger analysis (Online Gemini API or Offline Rule Engine)
  const handleAnalyze = async () => {
    if (!selectedImage && !textInput.trim()) {
      alert('Veuillez photographier un document, importer un fichier ou coller le texte allemand.');
      return;
    }

    if (!isOnline && selectedImage && !textInput.trim()) {
      alert('La lecture OCR d’une photo nécessite une connexion Internet dans cette version bêta. Pour une analyse locale, collez le texte allemand du document dans le champ prévu à cet effet.');
      return;
    }

    setIsAnalyzing(true);

    if (isOnline) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/analyze-document`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: selectedImage,
            mimeType,
            textInput: textInput.trim() || undefined,
            profileType: `${userProfile.status} nouvellement arrivé à ${userProfile.city}`,
          }),
        });

        const data = await response.json();
        if (data.success && data.analysis) {
          const doc: DocumentAnalysisResult = {
            id: 'doc_' + Date.now(),
            fileName: selectedImage ? 'Document_Photo_' + new Date().toLocaleDateString('fr-FR') : 'Texte_Allemand_Saisi',
            analyzedAt: new Date().toISOString(),
            isOfflineFallback: false,
            ...data.analysis,
          };
          setAnalysisResult(doc);
        } else {
          throw new Error(data.message || 'Erreur lors de l’analyse');
        }
      } catch (err: any) {
        console.warn('API error, falling back to local extractor', err);
        if (selectedImage && !textInput.trim()) {
          alert('L’analyse OCR en ligne a échoué. ARIA ne peut pas lire cette photo hors ligne pour le moment. Réessayez avec une connexion ou collez le texte allemand du document.');
        } else {
          performLocalAnalysis();
        }
      } finally {
        setIsAnalyzing(false);
      }
    } else {
      // Offline mode
      setTimeout(() => {
        performLocalAnalysis();
        setIsAnalyzing(false);
      }, 800);
    }
  };

  // Local offline fallback: classify cautiously and only extract visible text patterns.
  // It must never invent a deadline, amount, legal duty, or claim to have OCR-read an image.
  const performLocalAnalysis = () => {
    const text = textInput.trim();
    const lower = text.toLocaleLowerCase('de-DE');
    const isRundfunk = /rundfunk|beitragsservice|ard|zdf/.test(lower);
    const isAnmeldung = /anmeldung|meldebestaetigung|meldebest[aä]tigung|buergeramt|bürgeramt|wohnungsgeber/.test(lower);
    const isAuPair = /au[ -]?pair|taschengeld|gastfamilie|sprachkurs/.test(lower);

    const possibleType = isRundfunk
      ? 'Document possiblement lié au Rundfunkbeitrag'
      : isAnmeldung
        ? 'Document possiblement lié à l’Anmeldung'
        : isAuPair
          ? 'Document possiblement lié au séjour Au-Pair'
          : 'Document administratif allemand — type non identifié';

    const dateMatches = text.match(/\b(?:\d{1,2}[./-]){2}\d{2,4}\b|\b\d{1,2}\.\s*[A-Za-zÄÖÜäöü]+\s+\d{4}\b|\b(?:bis zum|spätestens|frist)\s+[^\n.;]{1,60}/gi) || [];
    const moneyMatches = text.match(/(?:\d{1,3}(?:[. ]\d{3})*(?:,\d{2})?\s?€|€\s?\d+(?:,\d{2})?)/g) || [];

    const localDoc: DocumentAnalysisResult = {
      id: 'doc_' + Date.now(),
      fileName: 'Texte_Saisi_Analyse_Locale',
      analyzedAt: new Date().toISOString(),
      isOfflineFallback: true,
      documentType: possibleType,
      issuer: 'Émetteur non confirmé — vérifier l’en-tête du document',
      urgencyLevel: 'information',
      summary: text
        ? 'Pré-analyse locale limitée. ARIA a repéré un thème possible et quelques éléments textuels, mais ne peut pas confirmer le sens juridique du courrier sans analyse complète. Ne prenez aucune décision de paiement ou de délai sur la seule base de cette pré-analyse.'
        : 'Aucun texte n’a été fourni. Une photo ne peut pas être lue hors connexion dans cette version bêta. Reconnectez-vous pour lancer l’OCR, ou collez ici le texte allemand.',
      extractedTextSample: text ? text.slice(0, 1200) : undefined,
      importantDates: dateMatches.length
        ? dateMatches.slice(0, 8).map(date => ({ date: date.trim(), label: 'Texte repéré automatiquement ; vérifier le contexte et le délai exact sur le document.' }))
        : [{ date: 'Aucune date repérée', label: 'Rechercher les mentions « Frist », « bis zum » ou « spätestens ».' }],
      obligations: ['Aucune obligation juridique ne peut être confirmée par cette analyse locale. Lire le courrier complet et vérifier auprès de son émetteur.'],
      financialImpact: moneyMatches.length
        ? `Montant(s) repéré(s) dans le texte : ${[...new Set(moneyMatches)].join(', ')}. Leur signification (somme due, remboursement ou simple référence) n’est pas déterminée.`
        : 'Aucun montant repéré automatiquement.',
      actionSteps: [
        'Identifier l’émetteur, le titre du courrier et le numéro de dossier (Aktenzeichen).',
        'Repérer les mots « Frist », « Zahlungsaufforderung », « Bescheid » et « Widerspruch » ainsi que leur contexte.',
        'En cas de paiement demandé ou de délai proche, contacter directement l’émetteur ou un service de conseil avant d’agir.',
        'Pour une traduction et une analyse du document complet, reconnectez-vous et relancez l’analyse en ligne.',
      ],
      pitfallsToAvoid: 'Ne pas supposer qu’un montant repéré est forcément à payer. Ne pas ignorer un courrier officiel, mais ne pas effectuer de paiement sans vérifier son authenticité et son contexte.',
      keyVocabulary: [
        { german: 'Frist', french: 'délai / échéance' },
        { german: 'Aktenzeichen', french: 'référence / numéro de dossier' },
        { german: 'Zahlungsaufforderung', french: 'demande de paiement' },
      ],
      officialSource: 'Pré-analyse locale ARIA — aucune source officielle vérifiée automatiquement',
    };

    setAnalysisResult(localDoc);
  };

  // Save document to local storage archive
  const handleSaveToArchive = () => {
    if (!analysisResult) return;
    const updated = StorageService.saveDocument(analysisResult);
    setSavedDocs(updated);
    alert('Document enregistré avec succès dans votre coffre-fort local !');
  };

  const handleDeleteSaved = (id: string) => {
    const updated = StorageService.deleteDocument(id);
    setSavedDocs(updated);
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header Info */}
      <div className="bg-gradient-to-br from-[#143627] to-[#1b4332] text-white p-4 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-white/10 px-2 py-0.5 rounded-full">
            Assistant de documents & contrats
          </span>
          <span className="text-xs text-emerald-200">
            {isOnline ? 'IA Gemini en ligne prête' : 'Mode analyse locale'}
          </span>
        </div>

        <h2 className="text-lg font-bold text-white mt-2 leading-tight">
          Déchiffre tes courriers allemands sans stress
        </h2>
        <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
          Prends en photo une lettre ou un contrat : ARIA extrait les dates limites, les pièges et t'explique exactement quoi faire en français.
        </p>

        {/* Tab Switcher */}
        <div className="mt-3 grid grid-cols-2 gap-1 bg-black/20 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('scan')}
            className={`py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'scan' ? 'bg-white text-[#143627] shadow' : 'text-emerald-200'
            }`}
          >
            Scanner un document
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-1.5 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1 ${
              activeTab === 'history' ? 'bg-white text-[#143627] shadow' : 'text-emerald-200'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Mes scans sauvegardés ({savedDocs.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'scan' ? (
        <>
          {/* Document Capture & Input Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              1. Choisir le document à analyser
            </h3>

            {/* Camera / Upload buttons */}
            <div className="grid grid-cols-2 gap-2">
              {/* Native Android Camera input */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleImageSelect}
              />
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-50 transition active:scale-95"
              >
                <Camera className="w-6 h-6 text-emerald-600 mb-1" />
                <span className="text-xs font-bold">Prendre une photo</span>
                <span className="text-[10px] text-slate-500">Appareil photo</span>
              </button>

              {/* Gallery / File input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleImageSelect}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-3.5 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition active:scale-95"
              >
                <Upload className="w-6 h-6 text-slate-500 mb-1" />
                <span className="text-xs font-bold">Importer un fichier</span>
                <span className="text-[10px] text-slate-500">Galerie ou PDF</span>
              </button>
            </div>

            {/* Image Preview if chosen */}
            {selectedImage && (
              <div className="relative rounded-xl overflow-hidden border border-emerald-300 bg-slate-900 max-h-48 flex items-center justify-center">
                <img src={selectedImage} alt="Document scanné" className="max-h-48 object-contain" />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Sample Document Pill Triggers */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block mb-1.5">
                Ou tester immédiatement avec un courrier type :
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SAMPLE_DOCUMENTS.map(sample => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      setTextInput(sample.text);
                      setSelectedImage(null);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700 transition"
                  >
                    📄 {sample.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Raw Text Input Area */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                Ou coller le texte allemand reçu :
              </label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Exemple : Sehr geehrte Damen und Herren, Sie sind laut Bundesmeldegesetz..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>

            {/* Launch Analysis Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || (!selectedImage && !textInput.trim())}
              className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition shadow-md ${
                isAnalyzing || (!selectedImage && !textInput.trim())
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-[#143627] hover:bg-[#1b4332] text-white'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Analyse intelligente du document en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>
                    {isOnline ? 'Analyser avec Gemini Vision' : 'Analyser en mode local hors-ligne'}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-lg space-y-4">
              {/* Document Header & Urgency Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        analysisResult.urgencyLevel === 'urgent'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                          : analysisResult.urgencyLevel === 'attention'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}
                    >
                      {analysisResult.urgencyLevel === 'urgent'
                        ? 'Urgent · Réponse requise'
                        : analysisResult.urgencyLevel === 'attention'
                        ? 'Attention · À vérifier'
                        : 'Information officielle'}
                    </span>
                    {analysisResult.isOfflineFallback && (
                      <span className="text-[10px] bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded font-semibold">
                        Analyse locale hors-ligne
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                    {analysisResult.documentType}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Émetteur : <strong>{analysisResult.issuer}</strong>
                  </p>
                </div>

                <button
                  onClick={handleSaveToArchive}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold shrink-0 active:scale-95 transition"
                  title="Garder dans mes documents locaux"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>

              {/* French Friendly Summary */}
              <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-3.5 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-xs">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-1">
                  💡 Ce que signifie ce document en clair :
                </span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {analysisResult.summary}
                </p>
              </div>

              {/* Deadlines & Key Dates */}
              {analysisResult.importantDates && analysisResult.importantDates.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Dates limites & Délais stricts (Fristen)</span>
                  </h4>
                  <div className="space-y-1.5">
                    {analysisResult.importantDates.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-xs"
                      >
                        <span className="font-bold text-amber-900 dark:text-amber-200 shrink-0">
                          {item.date}
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Obligations & Action Steps */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ce que vous DEVEZ faire étape par étape</span>
                </h4>
                <div className="space-y-2">
                  {analysisResult.actionSteps?.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-[#143627] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-slate-700 dark:text-slate-200 leading-relaxed">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Conditions */}
              {analysisResult.financialImpact && (
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between">
                  <span className="text-slate-500">Montant ou impact financier :</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {analysisResult.financialImpact}
                  </span>
                </div>
              )}

              {/* Critical Pitfalls */}
              {analysisResult.pitfallsToAvoid && (
                <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs">
                  <span className="font-bold text-rose-900 dark:text-rose-200 flex items-center gap-1.5 mb-1">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Piège à éviter absolument :</span>
                  </span>
                  <p className="text-rose-800 dark:text-rose-300 leading-relaxed">
                    {analysisResult.pitfallsToAvoid}
                  </p>
                </div>
              )}

              {/* Key Bilingual Terms */}
              {analysisResult.keyVocabulary && analysisResult.keyVocabulary.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Lexique allemand du document
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {analysisResult.keyVocabulary.map((vocab, vIdx) => (
                      <div
                        key={vIdx}
                        className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                      >
                        <p className="font-bold text-slate-900 dark:text-white">
                          {vocab.german}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {vocab.french}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* Saved Scans Archive */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Documents archivés sur votre smartphone ({savedDocs.length})
            </h3>
            <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
              100% hors-ligne & sécurisé
            </span>
          </div>

          {savedDocs.length === 0 ? (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
              <Archive className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              Vous n'avez pas encore de document scanné sauvegardé. Scannez une lettre ou un contrat et appuyez sur « Enregistrer » !
            </div>
          ) : (
            savedDocs.map(doc => (
              <div
                key={doc.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                      {doc.issuer}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      {doc.documentType}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Scanné le {new Date(doc.analyzedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteSaved(doc.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition"
                    title="Supprimer de l'appareil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                  {doc.summary}
                </p>

                {doc.importantDates && doc.importantDates[0] && (
                  <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                    📅 Date limite : {doc.importantDates[0].date} ({doc.importantDates[0].label})
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
