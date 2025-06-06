
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

interface LearningNavigationProps {
  materialKeys: string[];
  materials: any;
  currentSection: number;
  completedSections: string[];
  onSectionChange: (index: number) => void;
}

const LearningNavigation = ({ 
  materialKeys, 
  materials, 
  currentSection, 
  completedSections, 
  onSectionChange 
}: LearningNavigationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Learning Sections</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {materialKeys.map((key, index) => (
          <Button
            key={key}
            variant={currentSection === index ? "default" : "outline"}
            className="w-full justify-start text-left h-auto p-3 min-h-[60px] whitespace-normal"
            onClick={() => onSectionChange(index)}
          >
            <div className="flex items-start space-x-2 w-full">
              <div className="flex-shrink-0 mt-1">
                {completedSections.includes(key) ? 
                  <CheckCircle className="h-4 w-4 text-green-500" /> : 
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm leading-tight break-words">
                  {materials[key as keyof typeof materials].title}
                </div>
                <div className="text-xs text-gray-500 mt-1">Section {index + 1}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default LearningNavigation;
