import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, BatteryCharging, ShieldCheck, Settings } from 'lucide-react';
import { UserProfile } from '../../types';

interface AndroidStatusBarProps {
  isOnline: boolean;
  userProfile: UserProfile;
  onOpenSettings: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  isOnline,
  userProfile,
  onOpenSettings,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#143627] text-white pt-safe select-none shadow-md">
      {/* Native-style micro status bar */}
      <div className="flex items-center justify-between px-4 py-1 text-xs font-medium tracking-tight text-emerald-100/90 border-b border-emerald-800/40">
        <div className="flex items-center gap-1.5 font-semibold">
          <span>{currentTime || '12:00'}</span>
          <span className="text-[10px] text-emerald-300">· Berlin</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Offline/Online hardware badge */}
          <div className="flex items-center gap-1">
            {isOnline ? (
              <span className="flex items-center gap-1 text-[11px] text-emerald-300" title="Connecté au réseau">
                <Wifi className="w-3.5 h-3.5" />
                <span>4G/Wi-Fi</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold" title="Mode Hors-Ligne actif">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Hors-Ligne</span>
              </span>
            )}
          </div>

          {/* Battery indicator */}
          <div className="flex items-center gap-0.5 text-emerald-200" title="Batterie 94%">
            <BatteryCharging className="w-3.5 h-3.5" />
            <span className="text-[10px]">94%</span>
          </div>
        </div>
      </div>

      {/* Main App Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#143627] via-[#1b4332] to-[#143627]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-sm text-white font-black text-lg tracking-wider">
            A
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white leading-none">ARIA</h1>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                Allemagne
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 mt-0.5 flex items-center gap-1">
              <span>{userProfile.name}</span>
              <span>·</span>
              <span className="capitalize">
                {userProfile.status === 'au_pair'
                  ? 'Au Pair'
                  : userProfile.status === 'fsj_bfd'
                  ? 'FSJ / BFD'
                  : userProfile.status === 'ausbildung'
                  ? 'Ausbildung'
                  : 'Études'}
              </span>
              <span>·</span>
              <span>{userProfile.city}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenSettings}
            className="w-9 h-9 rounded-full flex items-center justify-center text-emerald-100 hover:text-white hover:bg-emerald-800/50 active:scale-95 transition"
            aria-label="Paramètres de l'application"
            title="Paramètres & Données locales"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
