
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wutlnloajnuppgtezhys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxubG9ham51cHBndGV6aHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjYzMjksImV4cCI6MjA2NDgwMjMyOX0.P-7xFr9BkqKMEkK9kDFIB0V_AHkmlJBavd4XyxyimxI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface QuizAnalysisResult {
  score: number;
  weakAreas: string[];
  personalizedFeedback: string;
  recommendations: string[];
}

interface LearningContentRequest {
  topic: string;
  weakAreas: string[];
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
}

class SupabaseService {
  async analyzeQuizResults(
    questions: any[], 
    answers: number[], 
    topic: string,
    userId?: string
  ): Promise<QuizAnalysisResult> {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-quiz', {
        body: {
          questions,
          answers,
          topic,
          userId
        }
      })

      if (error) throw error
      return data

    } catch (error) {
      console.error('Error analyzing quiz results:', error);
      // Fallback to simple analysis
      const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
      const score = Math.round((correctAnswers / questions.length) * 100);
      const weakAreas = questions.filter((q, index) => answers[index] !== q.correct).map(q => q.topic);
      
      return {
        score,
        weakAreas: [...new Set(weakAreas)],
        personalizedFeedback: "AI analysis temporarily unavailable. Please review the topics you missed.",
        recommendations: ["Review the missed topics", "Practice with additional questions", "Focus on key concepts"]
      };
    }
  }

  async generatePersonalizedContent(request: LearningContentRequest): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: request
      })

      if (error) throw error
      return data

    } catch (error) {
      console.error('Error generating personalized content:', error);
      throw error;
    }
  }

  async generateSpeech(text: string, voiceId?: string): Promise<Blob> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-speech', {
        body: {
          text,
          voiceId
        }
      })

      if (error) throw error
      
      // Convert the response to a blob
      const audioBlob = new Blob([data], { type: 'audio/mpeg' })
      return audioBlob

    } catch (error) {
      console.error('Error generating speech:', error);
      throw error;
    }
  }

  async saveQuizSession(sessionData: {
    userId: string;
    topic: string;
    score: number;
    weakAreas: string[];
    aiAnalysis: any;
  }) {
    // Skip database operations since tables don't exist yet
    console.log('Quiz session would be saved:', sessionData);
    return null;
  }

  async saveLearningProgress(progressData: {
    userId: string;
    topic: string;
    section: string;
    completed: boolean;
    timeSpent: number;
  }) {
    // Skip database operations since tables don't exist yet
    console.log('Learning progress would be saved:', progressData);
    return null;
  }

  async getUserProgress(userId: string) {
    // Skip database operations since tables don't exist yet
    console.log('User progress would be fetched for:', userId);
    return [];
  }
}

export const supabaseService = new SupabaseService();
