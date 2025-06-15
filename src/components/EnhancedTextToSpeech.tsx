
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
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
  const [hasError, setHasError] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleClick = async () => {
    if (isPlaying) {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      onStop();
      return;
    }

    setIsLoading(true);
    setHasError(false);
    
    try {
      // Use ElevenLabs via Supabase Edge Function
      const audioBlob = await aiService.generateSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      
      audio.onplay = () => {
        setIsLoading(false);
        onPlay(text);
      };
      
      audio.onended = () => {
        onStop();
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsLoading(false);
        setHasError(true);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing ElevenLabs audio');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      setIsLoading(false);
      setHasError(true);
      setCurrentAudio(null);
    }
  };

  if (hasError) {
    return (
      <Button
        variant="ghost"
        size={size}
        disabled
        className={`flex items-center space-x-2 text-red-500 ${className}`}
      >
        <AlertCircle className="h-4 w-4" />
        <span>Audio unavailable</span>
      </Button>
    );
  }

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
