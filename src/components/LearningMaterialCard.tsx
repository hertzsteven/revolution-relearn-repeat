
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen } from 'lucide-react';
import TextToSpeechButton from './TextToSpeechButton';
import { getContentText } from '@/utils/learningMaterials';

interface LearningMaterialCardProps {
  material: any;
  materialKey: string;
  currentSection: number;
  totalSections: number;
  isCompleted: boolean;
  isPlaying: boolean;
  onComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
  onPlayAudio: (text: string) => void;
  onStopAudio: () => void;
}

const LearningMaterialCard = ({
  material,
  materialKey,
  currentSection,
  totalSections,
  isCompleted,
  isPlaying,
  onComplete,
  onPrevious,
  onNext,
  onFinish,
  onPlayAudio,
  onStopAudio
}: LearningMaterialCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5" />
            <span>{material.title}</span>
          </CardTitle>
          <TextToSpeechButton
            text={getContentText(material, 'overview')}
            isPlaying={isPlaying}
            onPlay={onPlayAudio}
            onStop={onStopAudio}
          />
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="keypoints">Key Points</TabsTrigger>
            <TabsTrigger value="deepdive">Deep Dive</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Overview</h4>
              <TextToSpeechButton
                text={material.content.overview}
                isPlaying={isPlaying}
                onPlay={onPlayAudio}
                onStop={onStopAudio}
                variant="ghost"
                className="flex items-center space-x-1"
              />
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{material.content.overview}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="keypoints" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Key Points</h4>
              <TextToSpeechButton
                text={getContentText(material, 'keypoints')}
                isPlaying={isPlaying}
                onPlay={onPlayAudio}
                onStop={onStopAudio}
                variant="ghost"
                className="flex items-center space-x-1"
              />
            </div>
            <ul className="space-y-3">
              {material.content.keyPoints.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start space-x-3">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </TabsContent>
          
          <TabsContent value="deepdive" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Deep Dive</h4>
              <TextToSpeechButton
                text={material.content.deepDive}
                isPlaying={isPlaying}
                onPlay={onPlayAudio}
                onStop={onStopAudio}
                variant="ghost"
                className="flex items-center space-x-1"
              />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">{material.content.deepDive}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="examples" className="space-y-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Examples</h4>
              <TextToSpeechButton
                text={getContentText(material, 'examples')}
                isPlaying={isPlaying}
                onPlay={onPlayAudio}
                onStop={onStopAudio}
                variant="ghost"
                className="flex items-center space-x-1"
              />
            </div>
            <div className="space-y-3">
              {material.content.examples.map((example: string, idx: number) => (
                <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="text-gray-700">{example}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-between">
          <Button 
            variant="outline" 
            disabled={currentSection === 0}
            onClick={onPrevious}
          >
            Previous Section
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline"
              onClick={onComplete}
              disabled={isCompleted}
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </Button>
            
            {currentSection < totalSections - 1 ? (
              <Button onClick={onNext}>
                Next Section
              </Button>
            ) : (
              <Button 
                onClick={onFinish}
                disabled={!isCompleted}
                className="bg-green-600 hover:bg-green-700"
              >
                Take Quiz Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LearningMaterialCard;
