import React, { useState } from 'react';
import { VoiceConversationDemo } from '@/components/VoiceConversationDemo';
import { ConversationScreen } from '@/components/ConversationScreen';
import { PreferencesScreen } from '@/components/PreferencesScreen';
import { PodcastScreen } from '@/components/PodcastScreen';
import { Button } from '@/components/ui/button';

type AppState = 'voice' | 'conversation' | 'preferences' | 'podcast';

interface UserData {
  username: string;
  topic: string;
}

interface Preferences {
  style: string;
  duration: number;
  mood: string;
}

interface CompleteData {
  username: string;
  topic: string;
  style: string;
  duration: number;
  mood: string;
}

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppState>('voice');
  const [userData, setUserData] = useState<UserData>({ username: '', topic: '' });
  const [preferences, setPreferences] = useState<Preferences>({ 
    style: '', 
    duration: 0, 
    mood: '' 
  });

  // Handle voice conversation completion with all data
  const handleVoiceComplete = (data: CompleteData) => {
    setUserData({ username: data.username, topic: data.topic });
    setPreferences({ style: data.style, duration: data.duration, mood: data.mood });
    setCurrentScreen('podcast');
  };

  const handleConversationComplete = (data: UserData) => {
    setUserData(data);
    setCurrentScreen('preferences');
  };

  const handlePreferencesComplete = (prefs: Preferences) => {
    setPreferences(prefs);
    setCurrentScreen('podcast');
  };

  const switchToManualFlow = () => {
    setCurrentScreen('conversation');
  };

  return (
    <div className="min-h-screen">
      {currentScreen === 'voice' && (
        <div className="relative">
          <VoiceConversationDemo onComplete={handleVoiceComplete} />
          
          {/* Fallback option */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={switchToManualFlow}
              className="text-xs"
            >
              Use Manual Flow
            </Button>
          </div>
        </div>
      )}
      
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