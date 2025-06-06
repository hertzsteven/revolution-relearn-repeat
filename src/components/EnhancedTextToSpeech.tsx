
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { aiService } from '@/utils/aiService';

interface EnhancedTextToSpeechProps {
  text: string;
  isPlaying: boolean;
  onPlay: (text: string) => void;
  onStop: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const EnhancedTextToSpeech = ({ 
  text, 
  isPlaying, 
  onPlay, 
  onStop, 
  variant = 'outline',
  size = 'sm',
  className = ''
}: EnhancedTextToSpeechProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isPlaying) {
      onStop();
      return;
    }

    setIsLoading(true);
    
    try {
      // Use ElevenLabs API through Supabase Edge Function
      const audioBlob = await aiService.generateSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onloadstart = () => {
        setIsLoading(false);
        onPlay(text);
      };
      
      audio.onended = () => {
        onStop();
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsLoading(false);
        console.error('Audio playback failed');
        // Fallback to browser speech synthesis
        fallbackToWebSpeech();
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      setIsLoading(false);
      // Fallback to browser speech synthesis
      fallbackToWebSpeech();
    }
  };

  const fallbackToWebSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => onPlay(text);
      utterance.onend = () => onStop();
      utterance.onerror = () => onStop();
      
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center space-x-2 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span>
        {isLoading ? 'Loading...' : isPlaying ? 'Stop' : size === 'sm' ? 'Listen' : 'Listen'}
      </span>
    </Button>
  );
};

export default EnhancedTextToSpeech;
