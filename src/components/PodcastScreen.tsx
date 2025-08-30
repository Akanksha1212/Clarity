import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, MessageCircle, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { VoiceButton } from './VoiceButton';
import { cn } from '@/lib/utils';

interface PodcastScreenProps {
  topic: string;
  preferences: {
    style: string;
    duration: number;
    mood: string;
  };
}

export const PodcastScreen: React.FC<PodcastScreenProps> = ({ 
  topic, 
  preferences 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showQuestionInput, setShowQuestionInput] = useState(false);
  const [question, setQuestion] = useState('');
  const [questions, setQuestions] = useState<string[]>([]);
  
  // Simulated podcast content
  const podcastTitle = `Understanding ${topic}`;
  const duration = preferences.duration * 60; // Convert to seconds
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const restart = () => {
    setProgress(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuestion = () => {
    if (question.trim()) {
      setQuestions([...questions, question]);
      setQuestion('');
      setShowQuestionInput(false);
      // Simulate pausing for question
      setIsPlaying(false);
    }
  };

  const handleVoiceQuestion = (transcript: string) => {
    setQuestion(transcript);
    setShowQuestionInput(true);
  };

  const progressPercentage = (progress / duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-secondary flex flex-col items-center justify-start p-4 pt-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="text-xs">
            {preferences.style} • {preferences.duration} min • {preferences.mood}
          </Badge>
          <h1 className="text-xl font-bold">{podcastTitle}</h1>
        </div>

        {/* Player Card */}
        <Card className="p-6 space-y-6 shadow-elegant border-0 bg-card/80 backdrop-blur">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-gradient-primary h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={restart}
              className="h-12 w-12 rounded-full border-border/50"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            
            <Button
              onClick={togglePlayPause}
              className="h-16 w-16 rounded-full bg-gradient-primary hover:scale-105 transition-transform shadow-elegant"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-white" />
              ) : (
                <Play className="h-6 w-6 text-white ml-1" />
              )}
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowQuestionInput(true)}
              className="h-12 w-12 rounded-full border-border/50"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Voice Question Button */}
          <div className="flex justify-center">
            <div className="text-center space-y-2">
              <p className="text-xs text-muted-foreground">Ask a question</p>
              <VoiceButton
                onTranscript={handleVoiceQuestion}
                className="h-12 w-12"
              />
            </div>
          </div>
        </Card>

        {/* Question Input */}
        {showQuestionInput && (
          <Card className="p-4 space-y-3 shadow-elegant border-0 bg-card/80 backdrop-blur animate-in slide-in-from-bottom">
            <h3 className="font-medium text-sm">Ask your question</h3>
            <div className="space-y-2">
              <Input
                placeholder="What would you like to know?"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuestion()}
                className="border-border/50"
                autoFocus
              />
              <div className="flex space-x-2">
                <Button
                  onClick={handleQuestion}
                  disabled={!question.trim()}
                  className="flex-1 bg-gradient-primary"
                >
                  Ask Question
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowQuestionInput(false)}
                  className="border-border/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Recent Questions */}
        {questions.length > 0 && (
          <Card className="p-4 space-y-3 shadow-elegant border-0 bg-card/80 backdrop-blur">
            <h3 className="font-medium text-sm">Your Questions</h3>
            <div className="space-y-2">
              {questions.slice(-3).map((q, index) => (
                <div key={index} className="text-xs p-2 bg-muted/50 rounded-md">
                  {q}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Status */}
        <div className="text-center">
          {isPlaying ? (
            <div className="flex items-center justify-center space-x-2 text-primary">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium">Playing...</span>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {progress >= duration ? "Session Complete!" : "Paused - Tap play to continue"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};