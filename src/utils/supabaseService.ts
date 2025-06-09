import { createClient } from '@supabase/supabase-js'

// Use the actual Supabase project credentials
const supabaseUrl = 'https://wutlnloajnuppgtezhys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1dGxubG9ham51cHBndGV6aHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkyMjYzMjksImV4cCI6MjA2NDgwMjMyOX0.P-7xFr9BkqKMEkK9kDFIB0V_AHkmlJBavd4XyxyimxI'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
    if (!this.isConfigured()) {
      console.log('Supabase not configured, using fallback analysis');
      return this.getFallbackAnalysis(questions, answers);
    }

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
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured. Please set up Supabase integration to use this feature.');
    }

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
    if (!this.isConfigured()) {
      throw new Error('Supabase not configured. Please set up Supabase integration to use text-to-speech.');
    }

    try {
      const response = await fetch(`${supabaseUrl}/functions/v1/generate-speech`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voiceId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Speech generation failed: ${errorText}`);
      }

      // The edge function returns raw audio data as application/octet-stream
      const audioBlob = await response.blob();
      return audioBlob;

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
    if (!this.isConfigured()) {
      console.log('Supabase not configured, skipping quiz session save');
      return null;
    }

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
    if (!this.isConfigured()) {
      console.log('Supabase not configured, skipping progress save');
      return null;
    }

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
    if (!this.isConfigured()) {
      console.log('Supabase not configured, returning empty progress');
      return [];
    }

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
