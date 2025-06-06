
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QuizAnalysisRequest {
  questions: any[];
  answers: number[];
  topic: string;
  userId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { questions, answers, topic, userId }: QuizAnalysisRequest = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
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

    const result = {
      score,
      weakAreas: analysis.weakAreas,
      personalizedFeedback: analysis.personalizedFeedback,
      recommendations: analysis.recommendations
    };

    // Store quiz session in database if userId provided
    if (userId) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      await supabase.from('quiz_sessions').insert({
        user_id: userId,
        topic,
        score,
        weak_areas: analysis.weakAreas,
        ai_analysis: analysis,
        questions_data: questions,
        answers_data: answers
      });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in analyze-quiz function:', error);
    
    // Fallback analysis
    const { questions, answers } = await req.json();
    const correctAnswers = answers.filter((answer: number, index: number) => answer === questions[index].correct).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const weakAreas = questions.filter((q: any, index: number) => answers[index] !== q.correct).map((q: any) => q.topic);
    
    const fallbackResult = {
      score,
      weakAreas: [...new Set(weakAreas)],
      personalizedFeedback: "AI analysis temporarily unavailable. Please review the topics you missed.",
      recommendations: ["Review the missed topics", "Practice with additional questions", "Focus on key concepts"]
    };

    return new Response(JSON.stringify(fallbackResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
