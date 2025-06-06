
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Lightbulb, ArrowLeft, CheckCircle } from 'lucide-react';

interface LearningHeaderProps {
  topic: string;
  weakAreas: string[];
  completedSections: string[];
  materialKeys: string[];
  materials: any;
  onBack: () => void;
}

const LearningHeader = ({ 
  topic, 
  weakAreas, 
  completedSections, 
  materialKeys, 
  materials, 
  onBack 
}: LearningHeaderProps) => {
  const getTopicTitle = (topicKey: string) => {
    const titles = {
      causes: 'Causes of the Revolution',
      events: 'Key Events & Battles',
      figures: 'Important Figures',
      documents: 'Documents & Ideas'
    };
    return titles[topicKey as keyof typeof titles] || 'Learning Content';
  };

  return (
    <>
      <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Brain className="h-8 w-8 text-blue-500" />
          <div>
            <h1 className="text-3xl font-bold">{getTopicTitle(topic)} - Personalized Learning</h1>
            <p className="text-gray-600">AI-curated content based on your assessment results</p>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Lightbulb className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h3 className="font-medium text-blue-900">Personalized Learning Path</h3>
              <p className="text-blue-800 text-sm">
                Based on your quiz results, I've identified {weakAreas.length} area{weakAreas.length > 1 ? 's' : ''} 
                where additional study will help improve your understanding. Click the audio button to listen to any section.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Progress:</span>
          {materialKeys.map((key) => (
            <Badge 
              key={key} 
              variant={completedSections.includes(key) ? "default" : "outline"}
              className="flex items-center space-x-1"
            >
              {completedSections.includes(key) && <CheckCircle className="h-3 w-3" />}
              <span>{materials[key as keyof typeof materials].title}</span>
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
};

export default LearningHeader;
