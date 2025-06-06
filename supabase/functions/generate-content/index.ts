
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContentRequest {
  topic: string;
  weakAreas: string[];
  studentLevel: 'beginner' | 'intermediate' | 'advanced';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { topic, weakAreas, studentLevel }: ContentRequest = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `
    Create personalized learning content for a student studying the American Revolution.
    
    Topic: ${topic}
    Student's weak areas: ${weakAreas.join(', ')}
    Student level: ${studentLevel}

    Generate detailed content with:
    1. Overview - Clear explanation of the concept
    2. Key Points - 4-5 important bullet points
    3. Deep Dive - Detailed explanation focusing on the weak areas
    4. Examples - 3-4 specific historical examples

    Focus specifically on addressing the student's weak areas: ${weakAreas.join(', ')}

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
    const content = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: 'Content generation failed' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
