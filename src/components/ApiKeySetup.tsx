
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Key, AlertTriangle } from 'lucide-react';
import { aiService } from '@/utils/aiService';

interface ApiKeySetupProps {
  onKeysSet: () => void;
}

const ApiKeySetup = ({ onKeysSet }: ApiKeySetupProps) => {
  const [openaiKey, setOpenaiKey] = useState('');
  const [elevenlabsKey, setElevenlabsKey] = useState('');
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [showElevenlabsKey, setShowElevenlabsKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!openaiKey.trim() || !elevenlabsKey.trim()) {
      alert('Please enter both API keys');
      return;
    }

    setIsLoading(true);
    
    try {
      // Store keys in localStorage and set them in services
      localStorage.setItem('openai_api_key', openaiKey);
      localStorage.setItem('elevenlabs_api_key', elevenlabsKey);
      
      aiService.setApiKey(openaiKey);
      
      onKeysSet();
    } catch (error) {
      console.error('Error setting up API keys:', error);
      alert('Error setting up API keys. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Key className="h-6 w-6" />
            <span>AI Setup Required</span>
          </CardTitle>
          <p className="text-sm text-gray-600">
            Enter your API keys to enable AI-powered features
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">API Keys Required</p>
                <p>This app uses OpenAI for intelligent analysis and ElevenLabs for high-quality text-to-speech.</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="openai">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="openai"
                type={showOpenaiKey ? 'text' : 'password'}
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-..."
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowOpenaiKey(!showOpenaiKey)}
              >
                {showOpenaiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Get your key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="elevenlabs">ElevenLabs API Key</Label>
            <div className="relative">
              <Input
                id="elevenlabs"
                type={showElevenlabsKey ? 'text' : 'password'}
                value={elevenlabsKey}
                onChange={(e) => setElevenlabsKey(e.target.value)}
                placeholder="Enter ElevenLabs API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowElevenlabsKey(!showElevenlabsKey)}
              >
                {showElevenlabsKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Get your key from <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ElevenLabs Settings</a>
            </p>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={isLoading || !openaiKey.trim() || !elevenlabsKey.trim()}
          >
            {isLoading ? 'Setting up...' : 'Continue to App'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your API keys are stored locally and never sent to our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiKeySetup;
