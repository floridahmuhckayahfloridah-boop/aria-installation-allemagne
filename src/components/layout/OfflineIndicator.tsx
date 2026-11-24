import React from 'react';
import { WifiOff, Database, CheckCircle2 } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
  onRefresh?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ isOnline }) => {
  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-xs flex items-center justify-between shadow-inner select-none transition-all">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 shrink-0 text-amber-200" />
        <div>
          <span className="font-bold">Mode Hors-Ligne activé</span>
          <span className="hidden sm:inline text-amber-100 ml-1">
            — Les démarches, cours, cartes téléchargées et contacts restent disponibles localement.
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1.5 bg-amber-700/60 px-2 py-0.5 rounded text-[11px] font-medium shrink-0">
        <Database className="w-3 h-3 text-emerald-300" />
        <span>Base locale prête</span>
      </div>
    </div>
  );
};
