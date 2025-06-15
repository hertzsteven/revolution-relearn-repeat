import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, XCircle, Brain, Timer, Sparkles } from 'lucide-react';
import { aiService } from '@/utils/aiService';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

interface QuizInterfaceProps {
  topic: string;
  onComplete: (results: { score: number; weakAreas: string[]; aiAnalysis?: any }) => void;
  onBack: () => void;
}

const QuizInterface = ({ topic, onComplete, onBack }: QuizInterfaceProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  // Sample questions - in a real app, these would come from a database
  const questionSets = {
    causes: [
      {
        id: '1',
        question: 'Which act imposed a tax on paper goods and legal documents in the American colonies?',
        options: ['Sugar Act', 'Stamp Act', 'Tea Act', 'Intolerable Acts'],
        correct: 1,
        topic: 'taxation',
        difficulty: 'easy' as const,
        explanation: 'The Stamp Act of 1765 required colonists to pay a tax on printed materials, which was one of the first direct taxes imposed by Britain.'
      },
      {
        id: '2',
        question: 'What was the colonial response to "taxation without representation"?',
        options: ['Immediate acceptance', 'Peaceful negotiations only', 'Boycotts and protests', 'Military action'],
        correct: 2,
        topic: 'colonial_response',
        difficulty: 'medium' as const,
        explanation: 'Colonists organized boycotts of British goods and held protests, believing they should not be taxed without having representation in Parliament.'
      },
      {
        id: '3',
        question: 'Which philosopher\'s ideas about natural rights heavily influenced American revolutionary thought?',
        options: ['Thomas Hobbes', 'John Locke', 'Voltaire', 'Montesquieu'],
        correct: 1,
        topic: 'enlightenment',
        difficulty: 'hard' as const,
        explanation: 'John Locke\'s ideas about life, liberty, and property as natural rights were fundamental to American revolutionary ideology.'
      }
    ],
    events: [
      {
        id: '1',
        question: 'Where did the first shots of the American Revolution take place?',
        options: ['Lexington and Concord', 'Boston', 'Philadelphia', 'New York'],
        correct: 0,
        topic: 'battles',
        difficulty: 'easy' as const,
        explanation: 'The battles of Lexington and Concord on April 19, 1775, marked the beginning of armed conflict in the American Revolution.'
      }
    ],
    figures: [
      {
        id: '1',
        question: 'Who was the primary author of the Declaration of Independence?',
        options: ['John Adams', 'Benjamin Franklin', 'Thomas Jefferson', 'George Washington'],
        correct: 2,
        topic: 'founding_fathers',
        difficulty: 'easy' as const,
        explanation: 'Thomas Jefferson was chosen by the Continental Congress to draft the Declaration of Independence in 1776.'
      }
    ],
    documents: [
      {
        id: '1',
        question: 'In what year was the Declaration of Independence signed?',
        options: ['1775', '1776', '1777', '1778'],
        correct: 1,
        topic: 'founding_documents',
        difficulty: 'easy' as const,
        explanation: 'The Declaration of Independence was approved by the Continental Congress on July 4, 1776.'
      }
    ]
  };

  const questions = questionSets[topic as keyof typeof questionSets] || questionSets.causes;

  useEffect(() => {
    if (quizStarted && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
  }, [quizStarted, timeRemaining]);

  const startQuiz = () => {
    setQuizStarted(true);
    setTimeRemaining(300);
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(selectedAnswer);
    setAnswers(newAnswers);
    setSelectedAnswer('');

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = async (finalAnswers?: number[]) => {
    const submittedAnswers = finalAnswers || answers;
    setIsAnalyzing(true);
    
    console.log('Quiz submitted with answers:', submittedAnswers);
    console.log('Questions:', questions);
    
    // Calculate results immediately to ensure correct logic
    const correctAnswers = submittedAnswers.filter((answer, index) => answer === questions[index].correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const incorrectQuestions = questions.filter((q, index) => submittedAnswers[index] !== q.correct);
    const weakAreas = incorrectQuestions.map(q => q.topic);
    const uniqueWeakAreas = [...new Set(weakAreas)];
    
    console.log('Calculated results:', {
      correctAnswers,
      totalQuestions: questions.length,
      score,
      incorrectQuestions,
      weakAreas: uniqueWeakAreas
    });
    
    try {
      // Try to use AI service for enhanced analysis
      const analysis = await aiService.analyzeQuizResults(questions, submittedAnswers, topic);
      console.log('AI Analysis result:', analysis);
      
      // Ensure we use our calculated weak areas if AI doesn't provide them correctly
      const finalAnalysis = {
        ...analysis,
        score,
        weakAreas: analysis.weakAreas.length > 0 ? analysis.weakAreas : uniqueWeakAreas
      };
      
      setAiAnalysis(finalAnalysis);
      setShowResult(true);
      
      setTimeout(() => {
        console.log('Calling onComplete with:', {
          score: finalAnalysis.score,
          weakAreas: finalAnalysis.weakAreas,
          aiAnalysis: finalAnalysis
        });
        onComplete({ 
          score: finalAnalysis.score, 
          weakAreas: finalAnalysis.weakAreas,
          aiAnalysis: finalAnalysis
        });
      }, 4000);
    } catch (error) {
      console.error('Error analyzing quiz:', error);
      
      // Fallback to manual calculation
      const fallbackResults = {
        score,
        weakAreas: uniqueWeakAreas,
        personalizedFeedback: score >= 70 
          ? "Great work! You've demonstrated strong knowledge in this topic."
          : `You scored ${score}%. Let's work on improving your understanding of the areas you missed.`,
        recommendations: score >= 70 
          ? ["Continue to the next topic", "Review any challenging concepts"]
          : ["Review the missed topics", "Study the learning materials", "Retake the quiz when ready"]
      };
      
      console.log('Using fallback results:', fallbackResults);
      setAiAnalysis(fallbackResults);
      setShowResult(true);
      
      setTimeout(() => {
        console.log('Calling onComplete with fallback:', fallbackResults);
        onComplete(fallbackResults);
      }, 3000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTopicTitle = (topicKey: string) => {
    const titles = {
      causes: 'Causes of the Revolution',
      events: 'Key Events & Battles',
      figures: 'Important Figures',
      documents: 'Documents & Ideas'
    };
    return titles[topicKey as keyof typeof titles] || 'Quiz';
  };

  if (!quizStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Button>

        <Card className="text-center">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              <Brain className="h-6 w-6" />
              <span>{getTopicTitle(topic)} - AI Assessment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                Ready to test your knowledge? This AI-powered quiz will provide intelligent analysis and personalized learning recommendations.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-600">{questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-600">5:00</div>
                  <div className="text-sm text-gray-600">Time Limit</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="font-bold text-purple-600">70%</div>
                  <div className="text-sm text-gray-600">To Pass</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                <h3 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI-Powered Analysis</span>
                </h3>
                <p className="text-sm text-blue-700">
                  Our advanced AI analyzes your responses to provide personalized feedback, identify specific knowledge gaps, and generate custom learning content tailored to your needs.
                </p>
              </div>
            </div>

            <Button onClick={startQuiz} size="lg" className="text-lg px-8 py-3">
              Start AI Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResult) {
    const score = aiAnalysis?.score || 0;
    
    return (
      <div className="max-w-4xl mx-auto text-center">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-center space-x-2">
              {score >= 70 ? <CheckCircle className="h-6 w-6 text-green-500" /> : <Brain className="h-6 w-6 text-blue-500" />}
              <span>AI Assessment Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6 text-blue-500 animate-pulse" />
                  <span className="text-lg">AI is analyzing your responses...</span>
                </div>
                <Progress value={66} className="w-full max-w-md mx-auto" />
              </div>
            ) : (
              <>
                <div className="text-6xl font-bold text-blue-600">{score}%</div>
                <div className="space-y-2">
                  <div className="text-lg">
                    {score >= 70 ? "Excellent work! You've mastered this topic." : "Good effort! Let's work on strengthening your knowledge."}
                  </div>
                  <div className="text-gray-600">
                    You answered {Math.round((score / 100) * questions.length)} out of {questions.length} questions correctly.
                  </div>
                </div>
                
                {aiAnalysis && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto text-left">
                    <h3 className="font-medium text-blue-800 mb-2 flex items-center space-x-2">
                      <Sparkles className="h-4 w-4" />
                      <span>AI Analysis</span>
                    </h3>
                    <p className="text-blue-800 mb-3">{aiAnalysis.personalizedFeedback}</p>
                    {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                      <div>
                        <p className="font-medium text-blue-800 mb-2">Recommendations:</p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {aiAnalysis.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="text-blue-500">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  {score < 70 ? "Preparing personalized learning content..." : "Returning to dashboard..."}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <Button onClick={onBack} variant="outline" className="mb-6 flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Dashboard</span>
      </Button>

      {/* Quiz Header */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{getTopicTitle(topic)} - AI Assessment</h1>
          <div className="flex items-center space-x-2 text-lg font-mono">
            <Timer className="h-5 w-5" />
            <span className={timeRemaining < 60 ? 'text-red-500' : ''}>{formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{question.difficulty}</Badge>
            <Badge variant="secondary">{question.topic.replace('_', ' ')}</Badge>
          </div>
          <CardTitle className="text-xl leading-relaxed">{question.question}</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="text-base cursor-pointer flex-1">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion(prev => prev - 1)}
            >
              Previous
            </Button>
            
            <Button 
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
              className="px-8"
            >
              {currentQuestion === questions.length - 1 ? 'Submit for AI Analysis' : 'Next Question'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizInterface;
