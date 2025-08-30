import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VoiceButtonProps {
  onTranscript?: (text: string) => void;
  onStart?: () => void;
  onStop?: () => void;
  className?: string;
  disabled?: boolean;
}

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  onTranscript,
  onStart,
  onStop,
  className,
  disabled = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript?.(transcript);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
        onStop?.();
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        onStop?.();
      };
      
      setRecognition(recognitionInstance);
    }
  }, [onTranscript, onStop]);

  const toggleListening = () => {
    if (!recognition || disabled) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      onStop?.();
    } else {
      recognition.start();
      setIsListening(true);
      onStart?.();
    }
  };

  return (
    <Button
      onClick={toggleListening}
      disabled={disabled || !recognition}
      className={cn(
        "relative h-16 w-16 rounded-full shadow-elegant transition-all duration-300",
        isListening 
          ? "bg-gradient-voice scale-110 shadow-glow animate-pulse" 
          : "bg-gradient-primary hover:scale-105",
        className
      )}
    >
      {isListening ? (
        <MicOff className="h-6 w-6 text-white" />
      ) : (
        <Mic className="h-6 w-6 text-white" />
      )}
      
      {isListening && (
        <div className="absolute inset-0 rounded-full bg-gradient-voice opacity-50 animate-ping" />
      )}
    </Button>
  );
};