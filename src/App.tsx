import React, { useState, useEffect } from 'react';
import { AndroidStatusBar } from './components/layout/AndroidStatusBar';
import { BottomNavBar, ActiveTab } from './components/layout/BottomNavBar';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { PWAInstallBanner } from './components/layout/PWAInstallBanner';
import { HomeDashboard } from './components/home/HomeDashboard';
import { InteractiveMap } from './components/map/InteractiveMap';
import { AdministrativeAssistant } from './components/admin/AdministrativeAssistant';
import { DocumentAssistant } from './components/documents/DocumentAssistant';
import { GermanLearning } from './components/german/GermanLearning';
import { MadagascarVault } from './components/madagascar/MadagascarVault';
import { AIAssistantModal } from './components/ai/AIAssistantModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { UserProfile } from './types';
import { StorageService } from './services/storage';
import { ADMINISTRATIVE_PROCEDURES } from './data/administrativeProcedures';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [userProfile, setUserProfile] = useState<UserProfile>(StorageService.getProfile());
  const [completedProcedures, setCompletedProcedures] = useState<string[]>(StorageService.getCompletedProcedures());
  
  // Network detection & offline simulation
  const [isRealOnline, setIsRealOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const isOnline = isRealOnline && !isSimulatedOffline;

  // Modals
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiInitialTopic, setAiInitialTopic] = useState<string | undefined>(undefined);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsRealOnline(true);
    const handleOffline = () => setIsRealOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleProcedure = (id: string) => {
    const updated = StorageService.toggleProcedureCompleted(id);
    setCompletedProcedures(updated);
  };

  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const handleOpenAssistantWithTopic = (topic?: string) => {
    setAiInitialTopic(topic);
    setIsAIOpen(true);
  };

  // Pending critical procedures for bottom tab badge
  const pendingCriticalCount = ADMINISTRATIVE_PROCEDURES.filter(
    p => p.importance === 'critical' && 
         p.applicableStatuses.includes(userProfile.status) && 
         !completedProcedures.includes(p.id)
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      {/* Mobile Frame Container: behaves as native Android screen on mobile, and elegant framed mobile shell on desktop */}
      <div className="w-full max-w-md min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col relative shadow-2xl">
        {/* Top Status & App Bar */}
        <AndroidStatusBar
          isOnline={isOnline}
          userProfile={userProfile}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* PWA Install Banner */}
        <PWAInstallBanner />

        {/* Offline State Indicator */}
        <OfflineIndicator isOnline={isOnline} />

        {/* Main Content Area */}
        <main className="flex-1 p-3.5 overflow-y-auto">
          {activeTab === 'home' && (
            <HomeDashboard
              userProfile={userProfile}
              completedProcedures={completedProcedures}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAssistant={() => handleOpenAssistantWithTopic()}
            />
          )}

          {activeTab === 'admin' && (
            <AdministrativeAssistant
              userProfile={userProfile}
              completedProcedures={completedProcedures}
              onToggleComplete={handleToggleProcedure}
              onOpenAssistant={handleOpenAssistantWithTopic}
            />
          )}

          {activeTab === 'map' && (
            <InteractiveMap
              isOnline={isOnline}
              selectedCityName={userProfile.city}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentAssistant
              isOnline={isOnline}
              userProfile={userProfile}
            />
          )}

          {activeTab === 'german' && (
            <GermanLearning
              userProfile={userProfile}
            />
          )}

          {activeTab === 'madagascar' && (
            <MadagascarVault />
          )}
        </main>

        {/* Floating Action Button (FAB) for ARIA Assistant */}
        <button
          onClick={() => handleOpenAssistantWithTopic()}
          className="fixed bottom-20 right-4 sm:right-[max(1rem,calc(50%-13rem))] z-30 w-12 h-12 rounded-full bg-gradient-to-tr from-[#143627] to-[#2d6a4f] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform border-2 border-emerald-400/40"
          aria-label="Discuter avec l'assistante ARIA"
          title="Poser une question à ARIA"
        >
          <Sparkles className="w-5 h-5 text-emerald-300" />
        </button>

        {/* Bottom Navigation Bar */}
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          pendingTasksCount={pendingCriticalCount}
        />

        {/* AI Assistant Modal */}
        <AIAssistantModal
          isOpen={isAIOpen}
          onClose={() => {
            setIsAIOpen(false);
            setAiInitialTopic(undefined);
          }}
          isOnline={isOnline}
          userProfile={userProfile}
          initialTopic={aiInitialTopic}
        />

        {/* Settings & Offline Storage Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          isSimulatedOffline={isSimulatedOffline}
          onToggleSimulateOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
        />
      </div>
    </div>
  );
}
