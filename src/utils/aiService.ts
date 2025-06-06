
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
  private openaiApiKey: string | null = null;

  setApiKey(apiKey: string) {
    this.openaiApiKey = apiKey;
  }

  async analyzeQuizResults(
    questions: any[], 
    answers: number[], 
    topic: string
  ): Promise<QuizAnalysisResult> {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not set');
    }

    const incorrectAnswers = questions.map((q, index) => ({
      question: q.question,
      correctAnswer: q.options[q.correct],
      studentAnswer: q.options[answers[index]] || 'No answer',
      topic: q.topic,
      explanation: q.explanation
    })).filter((_, index) => answers[index] !== questions[index].correct);

    const prompt = `
    Analyze this student's quiz performance on the American Revolution topic: "${topic}"

    Incorrect answers:
    ${incorrectAnswers.map(ans => `
    Question: ${ans.question}
    Correct Answer: ${ans.correctAnswer}
    Student Answer: ${ans.studentAnswer}
    Topic: ${ans.topic}
    `).join('\n')}

    Please provide:
    1. Specific weak areas (be precise about historical concepts)
    2. Personalized feedback explaining what the student needs to work on
    3. 3-4 specific recommendations for improvement
    
    Respond in JSON format:
    {
      "weakAreas": ["specific_concept_1", "specific_concept_2"],
      "personalizedFeedback": "detailed feedback",
      "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
    }
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert American Revolution history tutor. Provide precise, educational analysis.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 800
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const analysis = JSON.parse(data.choices[0].message.content);
      
      const correctAnswers = answers.filter((answer, index) => answer === questions[index].correct).length;
      const score = Math.round((correctAnswers / questions.length) * 100);

      return {
        score,
        weakAreas: analysis.weakAreas,
        personalizedFeedback: analysis.personalizedFeedback,
        recommendations: analysis.recommendations
      };
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
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not set');
    }

    const prompt = `
    Create personalized learning content for a student studying the American Revolution.
    
    Topic: ${request.topic}
    Student's weak areas: ${request.weakAreas.join(', ')}
    Student level: ${request.studentLevel}

    Generate detailed content with:
    1. Overview - Clear explanation of the concept
    2. Key Points - 4-5 important bullet points
    3. Deep Dive - Detailed explanation focusing on the weak areas
    4. Examples - 3-4 specific historical examples

    Focus specifically on addressing the student's weak areas: ${request.weakAreas.join(', ')}

    Respond in JSON format:
    {
      "title": "content title",
      "content": {
        "overview": "overview text",
        "keyPoints": ["point 1", "point 2", "point 3", "point 4"],
        "deepDive": "detailed explanation",
        "examples": ["example 1", "example 2", "example 3"]
      }
    }
    `;

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert American Revolution history educator. Create engaging, accurate educational content.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.4,
          max_tokens: 1200
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('Error generating personalized content:', error);
      throw error;
    }
  }
}

export const aiService = new AIService();
