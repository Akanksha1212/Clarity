import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, Settings } from 'lucide-react';

interface VoiceConversationDemoProps {
  onComplete: (data: {
    username: string;
    topic: string;
    style: string;
    duration: number;
    mood: string;
  }) => void;
}

export const VoiceConversationDemo: React.FC<VoiceConversationDemoProps> = ({ 
  onComplete 
}) => {
  const [agentId, setAgentId] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const handleStartDemo = () => {
    // For demo purposes, let's simulate the conversation flow
    setTimeout(() => {
      const demoData = {
        username: 'demo_user',
        topic: 'Machine Learning Basics',
        style: 'podcast',
        duration: 15,
        mood: 'casual'
      };
      onComplete(demoData);
    }, 2000);
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
            <h2 className="text-xl font-semibold">AI Voice Assistant</h2>
            
            <p className="text-muted-foreground text-sm">
              Experience our conversational AI that will guide you through creating your personalized learning content.
            </p>

            {/* Configuration Section */}
            <div className="space-y-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfig(!showConfig)}
                className="w-full"
              >
                <Settings className="h-4 w-4 mr-2" />
                {showConfig ? 'Hide' : 'Show'} ElevenLabs Configuration
              </Button>

              {showConfig && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="agentId" className="text-xs">ElevenLabs Agent ID</Label>
                    <Input
                      id="agentId"
                      placeholder="Enter your agent ID..."
                      value={agentId}
                      onChange={(e) => setAgentId(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>📝 Create agent in ElevenLabs dashboard</p>
                    <p>🔧 Add client tools: setUsername, setLearningTopic, setPreferences</p>
                    <p>🔗 Generate signed URL from backend</p>
                    <p>🎯 Or create public agent for testing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Mode Button */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleStartDemo}
                className="w-full bg-gradient-primary hover:scale-105 transition-transform"
              >
                <Mic className="h-4 w-4 mr-2" />
                Start Demo Experience
              </Button>

              <p className="text-xs text-muted-foreground">
                Simulates the complete voice conversation flow
              </p>
            </div>

            {/* Real ElevenLabs Integration */}
            {showConfig && agentId.trim() && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    alert('ElevenLabs integration ready! This would start the real conversation with your configured agent.');
                  }}
                  className="w-full text-xs"
                >
                  Start Real ElevenLabs Conversation
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* How it Works */}
        <Card className="p-4 bg-muted/30 border-0">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-medium">Voice Conversation Flow:</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🎤 AI asks for your X username</p>
              <p>📚 You share what you want to learn</p>
              <p>⚙️ AI gets your learning preferences</p>
              <p>🎧 Personalized content is generated</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};