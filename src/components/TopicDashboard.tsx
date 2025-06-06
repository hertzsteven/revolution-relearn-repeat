
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Swords, 
  Users, 
  ScrollText, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Target
} from 'lucide-react';

interface TopicProgress {
  completed: boolean;
  score: number;
  weakAreas: string[];
}

interface TopicDashboardProps {
  onTopicSelect: (topic: string) => void;
  progress: Record<string, TopicProgress>;
  onViewProgress: () => void;
}

const TopicDashboard = ({ onTopicSelect, progress, onViewProgress }: TopicDashboardProps) => {
  const topics = [
    {
      id: 'causes',
      title: 'Causes of the Revolution',
      description: 'Explore the events and policies that led to colonial rebellion',
      icon: Scale,
      color: 'bg-red-500',
      details: 'Taxation, British policies, colonial grievances',
      estimatedTime: '20-30 minutes'
    },
    {
      id: 'events',
      title: 'Key Events & Battles',
      description: 'Major events that shaped the revolutionary war',
      icon: Swords,
      color: 'bg-blue-500',
      details: 'Boston Tea Party, Lexington & Concord, major battles',
      estimatedTime: '25-35 minutes'
    },
    {
      id: 'figures',
      title: 'Important Figures',
      description: 'Learn about the people who made the revolution possible',
      icon: Users,
      color: 'bg-green-500',
      details: 'Founding Fathers, military leaders, key personalities',
      estimatedTime: '15-25 minutes'
    },
    {
      id: 'documents',
      title: 'Documents & Ideas',
      description: 'Founding documents and revolutionary concepts',
      icon: ScrollText,
      color: 'bg-purple-500',
      details: 'Declaration of Independence, Enlightenment ideas',
      estimatedTime: '20-30 minutes'
    }
  ];

  const getTopicStatus = (topicId: string) => {
    const topicProgress = progress[topicId];
    if (!topicProgress) return 'not-started';
    if (topicProgress.completed) return 'completed';
    if (topicProgress.score > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />Needs Review</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />Not Started</Badge>;
    }
  };

  const overallProgress = Object.values(progress).reduce((acc, curr) => acc + (curr.completed ? 25 : 0), 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Your Revolutionary Journey</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Master the American Revolution through our adaptive learning system. Each topic builds upon the last, 
          with AI-powered assessments that identify your knowledge gaps and provide personalized learning experiences.
        </p>
        
        <Card className="max-w-md mx-auto">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={overallProgress} className="h-3" />
              <p className="text-sm text-gray-600 text-center">{overallProgress}% Complete</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic) => {
          const Icon = topic.icon;
          const status = getTopicStatus(topic.id);
          const topicProgress = progress[topic.id];
          
          return (
            <Card 
              key={topic.id} 
              className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-gray-200 hover:border-l-blue-500"
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${topic.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{topic.title}</CardTitle>
                      <CardDescription className="text-sm">{topic.details}</CardDescription>
                    </div>
                  </div>
                  {getStatusBadge(status)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600">{topic.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{topic.estimatedTime}</span>
                  </span>
                  {topicProgress && topicProgress.score > 0 && (
                    <span>Last Score: {topicProgress.score}%</span>
                  )}
                </div>

                {topicProgress && topicProgress.weakAreas.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-orange-600">Areas needing attention:</p>
                    <div className="flex flex-wrap gap-1">
                      {topicProgress.weakAreas.slice(0, 3).map((area, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button 
                  onClick={() => onTopicSelect(topic.id)}
                  className="w-full"
                  variant={status === 'completed' ? 'outline' : 'default'}
                >
                  {status === 'completed' ? 'Review Topic' : status === 'in-progress' ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Learning Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800">
          <ul className="space-y-2 text-sm">
            <li>• Take your time with each assessment - the AI adapts to your responses</li>
            <li>• Review weak areas thoroughly before retaking quizzes</li>
            <li>• Topics build on each other - complete them in order for best results</li>
            <li>• Aim for 70% or higher to master each topic</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicDashboard;
