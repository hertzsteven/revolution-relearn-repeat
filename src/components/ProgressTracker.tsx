
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Trophy, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  BarChart3
} from 'lucide-react';

interface TopicProgress {
  completed: boolean;
  score: number;
  weakAreas: string[];
}

interface ProgressTrackerProps {
  progress: Record<string, TopicProgress>;
  onBack: () => void;
}

const ProgressTracker = ({ progress, onBack }: ProgressTrackerProps) => {
  const topics = [
    { id: 'causes', title: 'Causes of the Revolution', icon: '⚖️' },
    { id: 'events', title: 'Key Events & Battles', icon: '⚔️' },
    { id: 'figures', title: 'Important Figures', icon: '👥' },
    { id: 'documents', title: 'Documents & Ideas', icon: '📜' }
  ];

  const completedTopics = Object.values(progress).filter(p => p.completed).length;
  const totalScore = Object.values(progress).reduce((sum, p) => sum + p.score, 0);
  const averageScore = totalScore / Object.keys(progress).length || 0;
  const overallProgress = (completedTopics / topics.length) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Very Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Good', color: 'bg-yellow-100 text-yellow-800' };
    if (score > 0) return { label: 'Needs Work', color: 'bg-red-100 text-red-800' };
    return { label: 'Not Started', color: 'bg-gray-100 text-gray-800' };
  };

  const allWeakAreas = Object.values(progress).flatMap(p => p.weakAreas);
  const weakAreaCounts = allWeakAreas.reduce((acc, area) => {
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topWeakAreas = Object.entries(weakAreaCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto">
      <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Trophy className="h-8 w-8 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold">Learning Progress Dashboard</h1>
            <p className="text-gray-600">Track your mastery of American Revolution topics</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>Overall Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{Math.round(overallProgress)}%</div>
              <Progress value={overallProgress} className="h-2" />
              <div className="text-xs text-gray-500">{completedTopics} of {topics.length} topics mastered</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Average Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                {Math.round(averageScore)}%
              </div>
              <Badge className={getScoreBadge(averageScore).color}>
                {getScoreBadge(averageScore).label}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Completed Topics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-green-600">{completedTopics}</div>
              <div className="text-xs text-gray-500">Topics mastered (≥70%)</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Improvement Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-orange-600">{allWeakAreas.length}</div>
              <div className="text-xs text-gray-500">Concepts to review</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Topic Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Topic Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topics.map(topic => {
              const topicProgress = progress[topic.id];
              const score = topicProgress?.score || 0;
              const completed = topicProgress?.completed || false;
              const badge = getScoreBadge(score);

              return (
                <div key={topic.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div>
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-sm text-gray-500">
                          {score > 0 ? `Latest Score: ${score}%` : 'Not attempted'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={badge.color}>{badge.label}</Badge>
                      {completed && <CheckCircle className="h-4 w-4 text-green-500" />}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Progress value={score} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span className="font-medium">70% to pass</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {topicProgress?.weakAreas.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-orange-600 flex items-center space-x-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Areas for improvement:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {topicProgress.weakAreas.slice(0, 3).map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area.replace('_', ' ')}
                          </Badge>
                        ))}
                        {topicProgress.weakAreas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{topicProgress.weakAreas.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Weak Areas Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Focus Areas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topWeakAreas.length > 0 ? (
              <>
                <p className="text-sm text-gray-600">
                  AI Analysis: These concepts appear most frequently in your incorrect answers. 
                  Focusing on these areas will have the biggest impact on your scores.
                </p>
                
                <div className="space-y-3">
                  {topWeakAreas.map(([area, count], index) => (
                    <div key={area} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-xs font-bold text-red-600">
                            {index + 1}
                          </div>
                          <span className="font-medium capitalize">
                            {area.replace('_', ' ')}
                          </span>
                        </div>
                        <Badge variant="outline">{count} topic{count > 1 ? 's' : ''}</Badge>
                      </div>
                      <div className="ml-8">
                        <Progress value={(count / topics.length) * 100} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Recommendation:</strong> Focus your next study session on these key concepts 
                    to see the biggest improvement in your quiz scores.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <p className="text-lg font-medium text-green-700">Excellent work!</p>
                <p className="text-sm text-gray-600">
                  No major weak areas identified. Keep up the great learning!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Learning Recommendations */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedTopics < topics.length && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Continue Learning</h3>
                <p className="text-blue-800 text-sm">
                  You have {topics.length - completedTopics} topic{topics.length - completedTopics > 1 ? 's' : ''} 
                  remaining to master. Keep up the momentum!
                </p>
              </div>
            )}
            
            {topWeakAreas.length > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-2">Review Weak Areas</h3>
                <p className="text-orange-800 text-sm">
                  Spend extra time reviewing {topWeakAreas[0][0].replace('_', ' ')} and other challenging concepts.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressTracker;
