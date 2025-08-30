import React, { useState } from 'react';
import { ConversationScreen } from '@/components/ConversationScreen';
import { PreferencesScreen } from '@/components/PreferencesScreen';
import { PodcastScreen } from '@/components/PodcastScreen';

type AppState = 'conversation' | 'preferences' | 'podcast';

interface UserData {
  username: string;
  topic: string;
}

interface Preferences {
  style: string;
  duration: number;
  mood: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('conversation');
  const [userData, setUserData] = useState<UserData>({ username: '', topic: '' });
  const [preferences, setPreferences] = useState<Preferences>({ 
    style: '', 
    duration: 0, 
    mood: '' 
  });

  const handleConversationComplete = (data: UserData) => {
    setUserData(data);
    setCurrentScreen('preferences');
  };

  const handlePreferencesComplete = (prefs: Preferences) => {
    setPreferences(prefs);
    setCurrentScreen('podcast');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'conversation' && (
        <ConversationScreen onComplete={handleConversationComplete} />
      )}
      {currentScreen === 'preferences' && (
        <PreferencesScreen 
          topic={userData.topic}
          onComplete={handlePreferencesComplete} 
        />
      )}
      {currentScreen === 'podcast' && (
        <PodcastScreen 
          topic={userData.topic}
          preferences={preferences}
        />
      )}
    </div>
  );
};

export default Index;