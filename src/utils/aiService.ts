
import { supabaseService } from './supabaseService';

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

class AIService {
  async analyzeQuizResults(
    questions: any[], 
    answers: number[], 
    topic: string
  ): Promise<QuizAnalysisResult> {
    return await supabaseService.analyzeQuizResults(questions, answers, topic);
  }

  async generatePersonalizedContent(request: LearningContentRequest): Promise<any> {
    return await supabaseService.generatePersonalizedContent(request);
  }

  async generateSpeech(text: string, voiceId?: string): Promise<Blob> {
    return await supabaseService.generateSpeech(text, voiceId);
  }
}

export const aiService = new AIService();
