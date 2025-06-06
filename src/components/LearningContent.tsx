import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Video, FileText, CheckCircle, Brain, Lightbulb } from 'lucide-react';

interface LearningContentProps {
  topic: string;
  weakAreas: string[];
  onComplete: () => void;
  onBack: () => void;
}

const LearningContent = ({ topic, weakAreas, onComplete, onBack }: LearningContentProps) => {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  const learningMaterials = {
    causes: {
      taxation: {
        title: 'British Taxation Policies',
        content: {
          overview: 'After the French and Indian War (1754-1763), Britain faced massive debt and decided to tax the American colonies to help pay for it. This marked a significant shift in British colonial policy.',
          keyPoints: [
            'The Sugar Act (1764) - First attempt at direct taxation',
            'The Stamp Act (1765) - Tax on printed materials',
            'The Tea Act (1773) - Led to the Boston Tea Party',
            'The Intolerable Acts (1774) - Punishment for Boston Tea Party'
          ],
          deepDive: 'The colonists opposed these taxes not just because of the financial burden, but because they had no representation in Parliament. The phrase "taxation without representation" became a rallying cry for colonial resistance.',
          examples: [
            'Stamp Act required tax stamps on newspapers, legal documents, and playing cards',
            'Tea Act gave British East India Company monopoly on tea sales in colonies',
            'Colonists responded with boycotts, protests, and the formation of groups like Sons of Liberty'
          ]
        }
      },
      colonial_response: {
        title: 'Colonial Resistance and Response',
        content: {
          overview: 'Colonists developed various forms of resistance to British policies, from peaceful protests to organized boycotts and eventually armed resistance.',
          keyPoints: [
            'Non-importation agreements and boycotts',
            'Formation of resistance groups like Sons of Liberty',
            'Committees of Correspondence for communication',
            'Continental Congresses for unified colonial action'
          ],
          deepDive: 'Colonial resistance evolved from individual complaints to organized, coordinated efforts across all thirteen colonies. This unity was crucial for the eventual success of the revolution.',
          examples: [
            'Boston Tea Party (1773) - Direct action against Tea Act',
            'First Continental Congress (1774) - Coordinated colonial response',
            'Boycotts reduced British imports by 40% in some years'
          ]
        }
      },
      enlightenment: {
        title: 'Enlightenment Ideas and Natural Rights',
        content: {
          overview: 'Enlightenment philosophers provided the intellectual foundation for American revolutionary thought, particularly concepts of natural rights and government by consent.',
          keyPoints: [
            'John Locke\'s theory of natural rights (life, liberty, property)',
            'Social contract theory - government derives power from consent',
            'Separation of powers (Montesquieu)',
            'Popular sovereignty - power belongs to the people'
          ],
          deepDive: 'These ideas fundamentally challenged the divine right of kings and absolute monarchy, providing colonists with philosophical justification for resistance and eventually independence.',
          examples: [
            'Declaration of Independence echoes Locke\'s natural rights theory',
            'Colonial assemblies practiced self-governance based on consent',
            'Pamphlets like "Common Sense" spread Enlightenment ideas to common people'
          ]
        }
      }
    }
  };

  const getTopicTitle = (topicKey: string) => {
    const titles = {
      causes: 'Causes of the Revolution',
      events: 'Key Events & Battles',
      figures: 'Important Figures',
      documents: 'Documents & Ideas'
    };
    return titles[topicKey as keyof typeof titles] || 'Learning Content';
  };

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

  if (materialKeys.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>
        
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
      <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      {/* Header */}
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
                where additional study will help improve your understanding.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center space-x-2">
          <span className="text-sm text-gray-600">Progress:</span>
          {materialKeys.map((key, index) => (
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

      {/* Learning Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <div className="lg:col-span-1">
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
                  onClick={() => setCurrentSection(index)}
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
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {materialKeys.map((key, index) => {
            if (currentSection !== index) return null;
            
            const material = materials[key as keyof typeof materials];
            
            return (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>{material.title}</span>
                  </CardTitle>
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
                      <div className="prose max-w-none">
                        <p className="text-gray-700 leading-relaxed">{material.content.overview}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="keypoints" className="space-y-4">
                      <ul className="space-y-3">
                        {material.content.keyPoints.map((point, idx) => (
                          <li key={idx} className="flex items-start space-x-3">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                            <span className="text-gray-700">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="deepdive" className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed">{material.content.deepDive}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="examples" className="space-y-4">
                      <div className="space-y-3">
                        {material.content.examples.map((example, idx) => (
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
                      onClick={() => setCurrentSection(prev => prev - 1)}
                    >
                      Previous Section
                    </Button>
                    
                    <div className="space-x-2">
                      <Button 
                        variant="outline"
                        onClick={() => handleSectionComplete(key)}
                        disabled={completedSections.includes(key)}
                      >
                        {completedSections.includes(key) ? 'Completed' : 'Mark Complete'}
                      </Button>
                      
                      {currentSection < materialKeys.length - 1 ? (
                        <Button onClick={() => setCurrentSection(prev => prev + 1)}>
                          Next Section
                        </Button>
                      ) : (
                        <Button 
                          onClick={onComplete}
                          disabled={!allSectionsCompleted}
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
          })}
        </div>
      </div>

      {/* Completion Status */}
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
