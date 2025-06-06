
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface TextToSpeechButtonProps {
  text: string;
  isPlaying: boolean;
  onPlay: (text: string) => void;
  onStop: () => void;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const TextToSpeechButton = ({ 
  text, 
  isPlaying, 
  onPlay, 
  onStop, 
  variant = 'outline',
  size = 'sm',
  className = ''
}: TextToSpeechButtonProps) => {
  const handleClick = () => {
    if (isPlaying) {
      onStop();
    } else {
      onPlay(text);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`flex items-center space-x-2 ${className}`}
    >
      {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      <span>{isPlaying ? 'Stop' : size === 'sm' ? 'Play' : 'Listen'}</span>
    </Button>
  );
};

export default TextToSpeechButton;
