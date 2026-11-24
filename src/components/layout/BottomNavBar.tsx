import React from 'react';
import { Home, ClipboardList, MapPin, FileSearch, BookOpen, Heart } from 'lucide-react';

export type ActiveTab = 'home' | 'admin' | 'map' | 'documents' | 'german' | 'madagascar';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  pendingTasksCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  pendingTasksCount = 0,
}) => {
  const tabs = [
    {
      id: 'home' as ActiveTab,
      label: 'Accueil',
      icon: Home,
    },
    {
      id: 'admin' as ActiveTab,
      label: 'Démarches',
      icon: ClipboardList,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'map' as ActiveTab,
      label: 'Carte',
      icon: MapPin,
    },
    {
      id: 'documents' as ActiveTab,
      label: 'Documents',
      icon: FileSearch,
    },
    {
      id: 'german' as ActiveTab,
      label: 'Allemand',
      icon: BookOpen,
    },
    {
      id: 'madagascar' as ActiveTab,
      label: 'Madagascar',
      icon: Heart,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe select-none shadow-lg">
      <div className="grid grid-cols-6 items-center h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-[#143627] dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              aria-label={tab.label}
            >
              {/* Active pill background effect */}
              {isActive && (
                <span className="absolute top-1.5 w-10 h-7 bg-emerald-100/70 dark:bg-emerald-900/40 rounded-full -z-0" />
              )}

              <div className="relative z-10">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="relative z-10 text-[10px] tracking-tight mt-1 truncate max-w-[54px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
