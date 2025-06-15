
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Loader2, AlertCircle } from 'lucide-react';
import { aiService } from '@/utils/aiService';
import { useToast } from '@/hooks/use-toast';

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
  const [usingBrowserTTS, setUsingBrowserTTS] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const playBrowserTTS = (textToSpeak: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => {
        setUsingBrowserTTS(true);
        onPlay(textToSpeak);
      };
      
      utterance.onend = () => {
        setUsingBrowserTTS(false);
        onStop();
      };
      
      utterance.onerror = () => {
        setUsingBrowserTTS(false);
        onStop();
        toast({
          title: "Audio Error",
          description: "Unable to play audio. Please try again.",
          variant: "destructive"
        });
      };
      
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Text-to-speech is not supported in this browser.",
        variant: "destructive"
      });
    }
  };

  const handleClick = async () => {
    if (isPlaying || usingBrowserTTS) {
      // Stop current audio
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setUsingBrowserTTS(false);
      onStop();
      return;
    }

    setIsLoading(true);
    
    try {
      // Try ElevenLabs via Supabase Edge Function first
      const audioBlob = await aiService.generateSpeech(text);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setCurrentAudio(audio);
      
      audio.onplay = () => {
        setIsLoading(false);
        onPlay(text);
        toast({
          title: "High-Quality Voice",
          description: "Playing with ElevenLabs TTS",
        });
      };
      
      audio.onended = () => {
        onStop();
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsLoading(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing ElevenLabs audio, falling back to browser TTS');
        // Fallback to browser TTS
        playBrowserTTS(text);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS, falling back to browser TTS:', error);
      setIsLoading(false);
      setCurrentAudio(null);
      
      // Show notification about fallback
      toast({
        title: "Using Browser Voice",
        description: "ElevenLabs TTS not configured. Using browser fallback.",
      });
      
      // Fallback to browser TTS
      playBrowserTTS(text);
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
      ) : (isPlaying || usingBrowserTTS) ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span>
        {isLoading ? 'Loading...' : (isPlaying || usingBrowserTTS) ? 'Stop' : size === 'sm' ? 'Listen' : 'Listen'}
      </span>
    </Button>
  );
};

export default EnhancedTextToSpeech;
