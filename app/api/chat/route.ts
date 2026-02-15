import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/gemini';
import type { Tool, Niche, Mode } from '@/types';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json(
        { error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { message, niche, tool, mode } = body as {
      message: string;
      niche: Niche;
      tool: Tool;
      mode: Mode;
    };

    if (!message || !niche || !tool || !mode) {
      return NextResponse.json(
        { error: 'Missing required fields: message, niche, tool, mode' },
        { status: 400 }
      );
    }

    const response = await generateContent(tool, niche, mode, message);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { error: `Failed to generate content: ${errorMessage}` },
      { status: 500 }
    );
  }
}
