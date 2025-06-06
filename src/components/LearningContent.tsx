
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import LearningHeader from './LearningHeader';
import LearningNavigation from './LearningNavigation';
import LearningMaterialCard from './LearningMaterialCard';
import { learningMaterials } from '@/utils/learningMaterials';

interface LearningContentProps {
  topic: string;
  weakAreas: string[];
  onComplete: () => void;
  onBack: () => void;
}

const LearningContent = ({ topic, weakAreas, onComplete, onBack }: LearningContentProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const getCurrentMaterials = () => {
    const materials = learningMaterials[topic as keyof typeof learningMaterials];
    if (!materials) return {};
    
    return Object.fromEntries(
      Object.entries(materials).filter(([key]) => weakAreas.includes(key))
    );
  };

  const materials = getCurrentMaterials();
  const materialKeys = Object.keys(materials);

  const handleSectionComplete = (sectionKey: string) => {
    if (!completedSections.includes(sectionKey)) {
      setCompletedSections([...completedSections, sectionKey]);
    }
  };

  const allSectionsCompleted = materialKeys.length > 0 && materialKeys.every(key => completedSections.includes(key));

  const playTextToSpeech = async (text: string) => {
    try {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
        setIsPlaying(false);
      }

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        
        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing text-to-speech:', error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  if (materialKeys.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <LearningHeader
          topic={topic}
          weakAreas={weakAreas}
          completedSections={completedSections}
          materialKeys={materialKeys}
          materials={materials}
          onBack={onBack}
        />
        
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <span>Great Job!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-600 mb-6">
              You've demonstrated strong knowledge in this topic area. No additional learning materials are needed at this time.
            </p>
            <Button onClick={onBack}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <LearningHeader
        topic={topic}
        weakAreas={weakAreas}
        completedSections={completedSections}
        materialKeys={materialKeys}
        materials={materials}
        onBack={onBack}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <LearningNavigation
            materialKeys={materialKeys}
            materials={materials}
            currentSection={currentSection}
            completedSections={completedSections}
            onSectionChange={setCurrentSection}
          />
        </div>

        <div className="lg:col-span-3">
          {materialKeys.map((key, index) => {
            if (currentSection !== index) return null;
            
            const material = materials[key as keyof typeof materials];
            
            return (
              <LearningMaterialCard
                key={key}
                material={material}
                materialKey={key}
                currentSection={currentSection}
                totalSections={materialKeys.length}
                isCompleted={completedSections.includes(key)}
                isPlaying={isPlaying}
                onComplete={() => handleSectionComplete(key)}
                onPrevious={() => setCurrentSection(prev => prev - 1)}
                onNext={() => setCurrentSection(prev => prev + 1)}
                onFinish={onComplete}
                onPlayAudio={playTextToSpeech}
                onStopAudio={stopAudio}
              />
            );
          })}
        </div>
      </div>

      {allSectionsCompleted && (
        <Card className="mt-6 bg-green-50 border-green-200">
          <CardContent className="flex items-center space-x-3 py-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Great work! You've completed all learning sections.</p>
              <p className="text-sm text-green-700">Ready to test your improved knowledge?</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningContent;
