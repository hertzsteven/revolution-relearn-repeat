
import { useState, useEffect } from 'react';
import TopicDashboard from '@/components/TopicDashboard';
import QuizInterface from '@/components/QuizInterface';
import LearningContent from '@/components/LearningContent';
import ProgressTracker from '@/components/ProgressTracker';
import ApiKeySetup from '@/components/ApiKeySetup';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen, Target, Trophy } from 'lucide-react';
import { aiService } from '@/utils/aiService';

export type AppMode = 'dashboard' | 'quiz' | 'learning' | 'progress';

const Index = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [hasApiKeys, setHasApiKeys] = useState(false);
  const [studentProgress, setStudentProgress] = useState({
    causes: { completed: false, score: 0, weakAreas: [] as string[], aiAnalysis: null },
    events: { completed: false, score: 0, weakAreas: [] as string[], aiAnalysis: null },
    figures: { completed: false, score: 0, weakAreas: [] as string[], aiAnalysis: null },
    documents: { completed: false, score: 0, weakAreas: [] as string[], aiAnalysis: null }
  });

  useEffect(() => {
    // Check if API keys are already stored
    const openaiKey = localStorage.getItem('openai_api_key');
    const elevenlabsKey = localStorage.getItem('elevenlabs_api_key');
    
    if (openaiKey && elevenlabsKey) {
      setHasApiKeys(true);
      aiService.setApiKey(openaiKey);
    }
  }, []);

  const handleApiKeysSet = () => {
    setHasApiKeys(true);
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCurrentMode('quiz');
  };

  const handleQuizComplete = (results: { score: number; weakAreas: string[]; aiAnalysis?: any }) => {
    setStudentProgress(prev => ({
      ...prev,
      [selectedTopic]: {
        completed: results.score >= 70,
        score: results.score,
        weakAreas: results.weakAreas,
        aiAnalysis: results.aiAnalysis || null
      }
    }));
    
    if (results.weakAreas.length > 0) {
      setCurrentMode('learning');
    } else {
      setCurrentMode('dashboard');
    }
  };

  if (!hasApiKeys) {
    return <ApiKeySetup onKeysSet={handleApiKeysSet} />;
  }

  const renderContent = () => {
    switch (currentMode) {
      case 'quiz':
        return (
          <QuizInterface 
            topic={selectedTopic}
            onComplete={handleQuizComplete}
            onBack={() => setCurrentMode('dashboard')}
          />
        );
      case 'learning':
        return (
          <LearningContent 
            topic={selectedTopic}
            weakAreas={studentProgress[selectedTopic as keyof typeof studentProgress]?.weakAreas || []}
            onComplete={() => setCurrentMode('quiz')}
            onBack={() => setCurrentMode('dashboard')}
          />
        );
      case 'progress':
        return (
          <ProgressTracker 
            progress={studentProgress}
            onBack={() => setCurrentMode('dashboard')}
          />
        );
      default:
        return (
          <TopicDashboard 
            onTopicSelect={handleTopicSelect}
            progress={studentProgress}
            onViewProgress={() => setCurrentMode('progress')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-amber-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">American Revolution Academy</h1>
                <p className="text-sm text-gray-600">AI-powered adaptive learning for American independence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                variant={currentMode === 'progress' ? 'default' : 'outline'}
                onClick={() => setCurrentMode('progress')}
                className="flex items-center space-x-2"
              >
                <Trophy className="h-4 w-4" />
                <span>Progress</span>
              </Button>
              
              {currentMode !== 'dashboard' && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentMode('dashboard')}
                  className="flex items-center space-x-2"
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            © 2024 American Revolution Academy - AI-powered adaptive learning
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
