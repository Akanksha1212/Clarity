import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { VoiceButton } from './VoiceButton';

interface ConversationScreenProps {
  onComplete: (data: { username: string; topic: string }) => void;
}

export const ConversationScreen: React.FC<ConversationScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'username' | 'topic'>('username');
  const [username, setUsername] = useState('');
  const [topic, setTopic] = useState('');
  const [isListening, setIsListening] = useState(false);

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setStep('topic');
    }
  };

  const handleTopicSubmit = () => {
    if (topic.trim()) {
      onComplete({ username, topic });
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (step === 'topic') {
      setTopic(transcript);
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Clarity.ai
          </h1>
          <p className="text-muted-foreground mt-2">Your AI Learning Companion</p>
        </div>

        {step === 'username' ? (
          <Card className="p-6 space-y-6 shadow-elegant border-0 bg-card/80 backdrop-blur">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-center">Welcome!</h2>
              <p className="text-muted-foreground text-center text-sm">
                Let's get started by connecting your X profile
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">X Username</label>
                <Input
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                  className="border-border/50"
                />
              </div>
              
              <Button 
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="w-full bg-gradient-primary hover:scale-105 transition-transform"
              >
                Continue <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 space-y-6 shadow-elegant border-0 bg-card/80 backdrop-blur">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-center">Hi @{username}!</h2>
              <p className="text-muted-foreground text-center text-sm">
                What would you like to learn today?
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Learning Topic</label>
                <Input
                  placeholder="e.g., Machine Learning, History of Rome..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTopicSubmit()}
                  className="border-border/50"
                />
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground">Or use voice input</p>
                  <VoiceButton
                    onTranscript={handleVoiceTranscript}
                    onStart={() => setIsListening(true)}
                    onStop={() => setIsListening(false)}
                  />
                  {isListening && (
                    <p className="text-xs text-voice-active animate-pulse">Listening...</p>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleTopicSubmit}
                disabled={!topic.trim()}
                className="w-full bg-gradient-primary hover:scale-105 transition-transform"
              >
                Let's Learn! <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};