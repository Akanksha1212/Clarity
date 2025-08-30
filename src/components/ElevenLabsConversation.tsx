import React, { useState, useCallback } from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ElevenLabsConversationProps {
  onDataCollected: (data: {
    username: string;
    topic: string;
    style: string;
    duration: number;
    mood: string;
  }) => void;
}

export const ElevenLabsConversation: React.FC<ElevenLabsConversationProps> = ({ 
  onDataCollected 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [collectedData, setCollectedData] = useState({
    username: '',
    topic: '',
    style: '',
    duration: 0,
    mood: ''
  });

  // Client tools that the AI can call to collect user data
  const clientTools = {
    setUsername: ({ username }: { username: string }) => {
      setCollectedData(prev => ({ ...prev, username }));
      return `Username set to ${username}`;
    },
    
    setLearningTopic: ({ topic }: { topic: string }) => {
      setCollectedData(prev => ({ ...prev, topic }));
      return `Learning topic set to ${topic}`;
    },
    
    setPreferences: ({ 
      style, 
      duration, 
      mood 
    }: { 
      style: string; 
      duration: number; 
      mood: string; 
    }) => {
      const updatedData = { ...collectedData, style, duration, mood };
      setCollectedData(updatedData);
      
      // If we have all required data, proceed to podcast generation
      if (updatedData.username && updatedData.topic && style && duration && mood) {
        setTimeout(() => {
          onDataCollected(updatedData);
        }, 1000);
      }
      
      return `Preferences set - Style: ${style}, Duration: ${duration} minutes, Mood: ${mood}`;
    }
  };

  const conversation = useConversation({
    clientTools,
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsConnected(true);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
      setIsConnected(false);
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      setIsConnected(false);
    },
    overrides: {
      agent: {
        prompt: {
          prompt: `You are Clarity.ai, a friendly AI learning companion. Your job is to help users create personalized learning experiences.

Follow this exact conversation flow:

1. FIRST: Greet the user warmly and ask for their X (Twitter) username. Use the setUsername tool when they provide it.

2. SECOND: Ask what they'd like to learn today. Be encouraging and suggest they can learn anything from machine learning to history. Use the setLearningTopic tool when they respond.

3. THIRD: Ask about their learning preferences all at once:
   - Learning style: "podcast" (conversational), "quiz" (interactive questions), or "story" (narrative)
   - Duration: how many minutes (5, 10, 15, 30, or 60)
   - Mood: "casual" (relaxed), "focused" (intensive), or "fun" (entertaining)
   
   Use the setPreferences tool with all three parameters when you have their answers.

Keep responses short, conversational, and encouraging. Don't move to the next step until you've collected the current information and used the appropriate tool.`,
        },
        firstMessage: "Hi there! Welcome to Clarity.ai, your AI learning companion. I'm excited to help you learn something new today! Let's start by getting to know you - what's your X username?",
        language: "en"
      },
      tts: {
        voiceId: "9BWtsMINqrJLrRacOk9x" // Aria voice
      }
    }
  });

  const startConversation = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // You would typically get this URL from your backend after generating a signed URL
      // For now, we'll use the agent ID directly (this requires the agent to be public)
      // Replace 'YOUR_AGENT_ID' with your actual ElevenLabs agent ID
      const agentId = process.env.ELEVENLABS_AGENT_ID || 'YOUR_AGENT_ID';
      
      await conversation.startSession({ 
        agentId: agentId
      });
    } catch (error) {
      console.error('Failed to start conversation:', error);
      alert('Failed to start conversation. Please check your microphone permissions and ElevenLabs configuration.');
    }
  };

  const endConversation = async () => {
    await conversation.endSession();
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

        <Card className="p-6 space-y-6 shadow-elegant border-0 bg-card/80 backdrop-blur">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold">
              {!isConnected ? 'Ready to Learn?' : 'Conversation Active'}
            </h2>
            
            <p className="text-muted-foreground text-sm">
              {!isConnected 
                ? 'Tap the button below to start your personalized learning journey with our AI companion.'
                : 'Your AI companion is listening and ready to help you learn something new today!'
              }
            </p>

            {/* Connection Status */}
            <div className="flex items-center justify-center space-x-2">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  isConnected ? "bg-green-500 animate-pulse" : "bg-muted"
                )}
              />
              <span className="text-xs text-muted-foreground">
                {conversation.status === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            {/* Speaking Indicator */}
            {conversation.isSpeaking && (
              <div className="text-center">
                <p className="text-voice-active text-sm animate-pulse">
                  AI is speaking...
                </p>
              </div>
            )}

            {/* Collected Data Progress */}
            {(collectedData.username || collectedData.topic) && (
              <div className="text-left space-y-1 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                <p className="font-medium">Progress:</p>
                {collectedData.username && <p>✓ Username: @{collectedData.username}</p>}
                {collectedData.topic && <p>✓ Topic: {collectedData.topic}</p>}
                {collectedData.style && <p>✓ Style: {collectedData.style}</p>}
                {collectedData.duration > 0 && <p>✓ Duration: {collectedData.duration} min</p>}
                {collectedData.mood && <p>✓ Mood: {collectedData.mood}</p>}
              </div>
            )}

            {/* Main Action Button */}
            <div className="pt-4">
              {!isConnected ? (
                <Button
                  onClick={startConversation}
                  className={cn(
                    "w-20 h-20 rounded-full shadow-elegant transition-all duration-300",
                    "bg-gradient-primary hover:scale-105 hover:shadow-glow"
                  )}
                >
                  <Phone className="h-8 w-8 text-white" />
                </Button>
              ) : (
                <Button
                  onClick={endConversation}
                  className={cn(
                    "w-20 h-20 rounded-full shadow-elegant transition-all duration-300",
                    "bg-destructive hover:scale-105"
                  )}
                >
                  <PhoneOff className="h-8 w-8 text-white" />
                </Button>
              )}
            </div>

            <p className="text-xs text-muted-foreground">
              {!isConnected 
                ? 'Start voice conversation' 
                : 'End conversation'
              }
            </p>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-muted/30 border-0">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium">How it works:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Start the voice conversation</p>
              <p>2. Share your X username</p>
              <p>3. Tell us what you want to learn</p>
              <p>4. Choose your preferences</p>
              <p>5. Get your personalized content!</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};