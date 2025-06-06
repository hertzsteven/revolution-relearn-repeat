
import { supabase } from '@/integrations/supabase/client'

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
  private isConfigured(): boolean {
    return supabase !== null
  }

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
      return this.getFallbackAnalysis(questions, answers);
    }
  }

  private getFallbackAnalysis(questions: any[], answers: number[]): QuizAnalysisResult {
    const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const weakAreas = questions.filter((q, index) => answers[index] !== q.correct).map(q => q.topic);
    
    return {
      score,
      weakAreas: [...new Set(weakAreas)],
      personalizedFeedback: "AI analysis requires Supabase configuration. Please review the topics you missed.",
      recommendations: ["Review the missed topics", "Practice with additional questions", "Focus on key concepts"]
    };
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

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      // The data should already be a blob or array buffer
      if (data instanceof Blob) {
        return data;
      }
      
      // If it's an array buffer, convert to blob
      if (data instanceof ArrayBuffer) {
        return new Blob([data], { type: 'audio/mpeg' });
      }
      
      // If it's base64 or other format, handle accordingly
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
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert({
          user_id: sessionData.userId,
          topic: sessionData.topic,
          score: sessionData.score,
          weak_areas: sessionData.weakAreas,
          ai_analysis: sessionData.aiAnalysis
        })

      if (error) throw error
      return data

    } catch (error) {
      console.error('Error saving quiz session:', error);
      throw error;
    }
  }

  async saveLearningProgress(progressData: {
    userId: string;
    topic: string;
    section: string;
    completed: boolean;
    timeSpent: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .upsert({
          user_id: progressData.userId,
          topic: progressData.topic,
          section: progressData.section,
          completed: progressData.completed,
          time_spent: progressData.timeSpent,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      return data

    } catch (error) {
      console.error('Error saving learning progress:', error);
      throw error;
    }
  }

  async getUserProgress(userId: string) {
    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data

    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    }
  }
}

export const supabaseService = new SupabaseService();
export { supabase };
