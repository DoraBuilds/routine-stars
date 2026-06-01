import { useState } from 'react';
import { AdminHome } from './AdminHome';
import { AdminKidProfile } from './AdminKidProfile';
import { AdminRoutines } from './AdminRoutines';
import { AdminAffirmations } from './AdminAffirmations';
import { AdminAchievements } from './AdminAchievements';
import { AdminMood } from './AdminMood';
import type { Child, RoutineType } from '@/lib/types';

type AdminScreen =
  | { screen: 'home' }
  | { screen: 'profile'; kidId: string }
  | { screen: 'routines'; kidId: string }
  | { screen: 'affirmations'; kidId: string }
  | { screen: 'achievements'; kidId: string }
  | { screen: 'mood'; kidId: string };

interface AdminAppProps {
  kids: Child[];
  onClose: () => void;
  onChangeMascot: (kidId: string, mascotId: string) => void;
  onAddTask: (kidId: string, routine: RoutineType) => void;
  onRemoveTask: (kidId: string, routine: RoutineType, taskId: string) => void;
  onAddAffirmation: (kidId: string, text: string) => void;
  onRemoveAffirmation: (kidId: string, idx: number) => void;
  onToggleBadge: (kidId: string, badgeId: string) => void;
  onAddKid: () => void;
  cloudSyncStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onSignOut?: () => void;
  onOpenAdvancedSettings?: () => void;
  onRestartSetup?: () => void;
  onResetAppData?: () => void;
}

export const AdminApp = ({
  kids,
  onClose,
  onChangeMascot,
  onAddTask,
  onRemoveTask,
  onAddAffirmation,
  onRemoveAffirmation,
  onToggleBadge,
  onAddKid,
  cloudSyncStatus,
  onSignOut,
  onOpenAdvancedSettings,
  onRestartSetup,
  onResetAppData,
}: AdminAppProps) => {
  const [path, setPath] = useState<AdminScreen>({ screen: 'home' });

  const kid = path.screen !== 'home' ? kids.find((k) => k.id === path.kidId) : null;

  // Navigation helpers
  const goHome = () => setPath({ screen: 'home' });

  const pickKid = (kidId: string, section: string) => {
    if (section === 'profile') {
      setPath({ screen: 'profile', kidId });
    } else if (section === 'routines') {
      setPath({ screen: 'routines', kidId });
    } else if (section === 'affirmations') {
      setPath({ screen: 'affirmations', kidId });
    } else if (section === 'achievements') {
      setPath({ screen: 'achievements', kidId });
    } else if (section === 'mood') {
      setPath({ screen: 'mood', kidId });
    }
  };

  if (path.screen === 'home') {
    return (
      <AdminHome
        kids={kids}
        onBack={onClose}
        onPickKid={pickKid}
        onAddKid={onAddKid}
        cloudSyncStatus={cloudSyncStatus}
        onSignOut={onSignOut}
        onOpenAdvancedSettings={onOpenAdvancedSettings}
        onRestartSetup={onRestartSetup}
        onResetAppData={onResetAppData}
      />
    );
  }

  if (!kid) return null;

  if (path.screen === 'profile') {
    return (
      <AdminKidProfile
        kid={kid}
        onBack={goHome}
        onPickSection={(section) => pickKid(kid.id, section)}
        onChangeMascot={onChangeMascot}
      />
    );
  }

  if (path.screen === 'routines') {
    return (
      <AdminRoutines
        kid={kid}
        onBack={goHome}
        onAddTask={onAddTask}
        onRemoveTask={onRemoveTask}
      />
    );
  }

  if (path.screen === 'affirmations') {
    return (
      <AdminAffirmations
        kid={kid}
        onBack={goHome}
        onAdd={onAddAffirmation}
        onRemove={onRemoveAffirmation}
      />
    );
  }

  if (path.screen === 'achievements') {
    return (
      <AdminAchievements
        kid={kid}
        onBack={goHome}
        onToggleBadge={onToggleBadge}
      />
    );
  }

  if (path.screen === 'mood') {
    return <AdminMood kid={kid} onBack={goHome} />;
  }

  return null;
};
