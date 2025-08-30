import React, { useState } from 'react';
import { ArrowRight, Clock, Headphones, Brain, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PreferencesScreenProps {
  onComplete: (preferences: {
    style: string;
    duration: number;
    mood: string;
  }) => void;
  topic: string;
}

export const PreferencesScreen: React.FC<PreferencesScreenProps> = ({ 
  onComplete, 
  topic 
}) => {
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(0);
  const [selectedMood, setSelectedMood] = useState<string>('');

  const styles = [
    { id: 'podcast', name: 'Podcast Style', icon: Headphones, description: 'Conversational learning' },
    { id: 'quiz', name: 'Quiz Mode', icon: Brain, description: 'Interactive questions' },
    { id: 'mood', name: 'Mood-Based', icon: Heart, description: 'Adaptive to your energy' }
  ];

  const durations = [
    { minutes: 5, label: '5 min', description: 'Quick dive' },
    { minutes: 15, label: '15 min', description: 'Deep focus' },
    { minutes: 30, label: '30 min', description: 'Full session' }
  ];

  const moods = [
    { id: 'energetic', name: 'Energetic', color: 'bg-gradient-voice' },
    { id: 'calm', name: 'Calm', color: 'bg-gradient-secondary' },
    { id: 'focused', name: 'Focused', color: 'bg-gradient-primary' }
  ];

  const handleSubmit = () => {
    if (selectedStyle && selectedDuration && selectedMood) {
      onComplete({
        style: selectedStyle,
        duration: selectedDuration,
        mood: selectedMood
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col items-center justify-start p-4 pt-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Learning Preferences</h1>
          <Badge variant="secondary" className="text-xs">
            Topic: {topic}
          </Badge>
        </div>

        {/* Learning Style */}
        <Card className="p-4 space-y-4 shadow-elegant border-0 bg-card/80 backdrop-blur">
          <h3 className="font-medium">Learning Style</h3>
          <div className="space-y-2">
            {styles.map((style) => (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-all hover:scale-[1.02]",
                  selectedStyle === style.id
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-center space-x-3">
                  <style.icon className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Duration */}
        <Card className="p-4 space-y-4 shadow-elegant border-0 bg-card/80 backdrop-blur">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-medium">Duration</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {durations.map((duration) => (
              <button
                key={duration.minutes}
                onClick={() => setSelectedDuration(duration.minutes)}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all hover:scale-[1.05]",
                  selectedDuration === duration.minutes
                    ? "border-primary bg-primary/5 shadow-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="font-medium">{duration.label}</div>
                <div className="text-xs text-muted-foreground">{duration.description}</div>
              </button>
            ))}
          </div>
        </Card>

        {/* Mood */}
        <Card className="p-4 space-y-4 shadow-elegant border-0 bg-card/80 backdrop-blur">
          <h3 className="font-medium">Current Mood</h3>
          <div className="grid grid-cols-3 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.id}
                onClick={() => setSelectedMood(mood.id)}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all hover:scale-[1.05]",
                  selectedMood === mood.id
                    ? "border-primary shadow-glow"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn("w-6 h-6 rounded-full mx-auto mb-1", mood.color)} />
                <div className="text-xs font-medium">{mood.name}</div>
              </button>
            ))}
          </div>
        </Card>

        <Button 
          onClick={handleSubmit}
          disabled={!selectedStyle || !selectedDuration || !selectedMood}
          className="w-full bg-gradient-primary hover:scale-105 transition-transform"
        >
          Generate My Learning Session <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};