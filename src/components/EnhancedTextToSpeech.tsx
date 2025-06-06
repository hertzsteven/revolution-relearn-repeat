
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
      const elevenlabsApiKey = aiService.getElevenlabsApiKey();
      
      if (!elevenlabsApiKey || elevenlabsApiKey === 'YOUR_ELEVENLABS_API_KEY_HERE') {
        // Fallback to browser speech synthesis
        onPlay(text);
        setIsLoading(false);
        return;
      }

      // Use ElevenLabs API for high-quality speech
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': elevenlabsApiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
            style: 0.0,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onplay = () => {
          setIsLoading(false);
          onPlay(text);
        };
        
        audio.onended = () => {
          onStop();
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setIsLoading(false);
          // Fallback to browser speech synthesis
          onPlay(text);
        };
        
        await audio.play();
      } else {
        throw new Error('ElevenLabs API failed');
      }
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      setIsLoading(false);
      // Fallback to browser speech synthesis
      onPlay(text);
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
