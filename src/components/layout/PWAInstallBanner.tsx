import React, { useState, useEffect } from 'react';
import { Download, Smartphone, X, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // Check if already running in standalone PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      setShowGuide(true);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <>
      <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between text-xs border-b border-emerald-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/30 flex items-center justify-center shrink-0">
            <Smartphone className="w-4 h-4 text-emerald-300" />
          </div>
          <div>
            <p className="font-semibold text-white leading-tight">Installer ARIA sur Android</p>
            <p className="text-[11px] text-emerald-200/80">Accès 100% hors-ligne et icône sur votre écran d'accueil</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold active:scale-95 transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Installer</span>
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 text-emerald-300 hover:text-white"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-slate-800">
            <h3 className="text-base font-bold text-slate-900">Installer comme application Android</h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Pour profiter de toutes les fonctionnalités hors-ligne et ouvrir ARIA en un clic :
            </p>
            <ol className="mt-3 space-y-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">1.</span>
                <span>Ouvrez le menu du navigateur (les <strong>trois points</strong> ⋮ en haut à droite).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">2.</span>
                <span>Appuyez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-emerald-700">3.</span>
                <span>Confirmez pour retrouver ARIA sur votre écran d'accueil Android !</span>
              </li>
            </ol>
            <button
              onClick={() => setShowGuide(false)}
              className="mt-4 w-full rounded-xl bg-[#143627] py-2.5 text-xs font-semibold text-white hover:bg-[#1b4332] active:scale-95 transition"
            >
              J'ai compris
            </button>
          </div>
        </div>
      )}
    </>
  );
};
