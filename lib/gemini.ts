import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Tool, Niche, Mode } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

function getModeInstruction(mode: Mode): string {
  if (mode === 'creative') {
    return 'You are a creative social media content expert. Be playful, witty, and use emojis naturally. Your tone should be casual, fun, and highly engaging. Think like a popular content creator.';
  }
  return 'You are a professional social media strategist focused on trends and news. Be informative, cite current trends, and maintain a polished professional tone. Think like a social media analyst.';
}

function getToolPrompt(tool: Tool, niche: Niche, mode: Mode, userInput: string): string {
  const modeInstruction = getModeInstruction(mode);
  const nicheContext = `The user is a ${niche} content creator.`;

  const prompts: Record<Tool, string> = {
    'Caption Generator': `${modeInstruction}
${nicheContext}

Generate an engaging Instagram/social media caption about: "${userInput}"

Requirements:
- Start with a strong hook (first line that grabs attention)
- Include a compelling body with value or story
- End with a clear call-to-action
- Keep it under 150 words
- Format it ready to copy-paste`,

    'Hashtag Generator': `${modeInstruction}
${nicheContext}

Generate a strategic set of 20-30 hashtags for ${niche} content about: "${userInput}"

Requirements:
- Mix of popular hashtags (1M+ posts), medium hashtags (100K-1M posts), and niche-specific hashtags (under 100K posts)
- Group them by category
- Make them relevant and specific to the topic
- Format them ready to copy-paste (with # symbols)`,

    'Viral Post Ideas': `${modeInstruction}
${nicheContext}

Generate 5 viral post ideas for ${niche} content.

Requirements:
- Focus on trending formats (carousels, reels, stories)
- Include relatable and shareable topics
- Each idea should have: Title, Format (reel/carousel/story/post), Hook, and Brief description
- Optimize for engagement and shares
- Number each idea clearly`,

    'Hook Generator': `${modeInstruction}
${nicheContext}

Create 10 attention-grabbing hooks for ${niche} reels/videos about: "${userInput}"

Requirements:
- Make them scroll-stopping and curiosity-driven
- Mix different hook styles: question, bold statement, controversy, story, statistic
- Each hook should be 1-2 sentences max
- Number each hook
- These should work for the first 3 seconds of a reel/video`,

    'Improve Caption': `${modeInstruction}
${nicheContext}

Improve this caption for ${niche} content:

"${userInput}"

Requirements:
- Make it more engaging and emotionally compelling
- Add relevant emojis strategically
- Improve the hook (first line)
- Add or improve the call-to-action
- Optimize for the Instagram/social media algorithm
- Show the improved version ready to copy-paste`,

    'Best Posting Time': `${modeInstruction}
${nicheContext}

Suggest optimal posting times for ${niche} content.

Requirements:
- Provide specific time ranges for each day of the week
- Consider platform algorithms and peak engagement times
- Factor in the ${niche} niche audience behavior
- Include timezone considerations (mention times in EST and note how to adjust)
- Explain WHY each time slot works
- Include tips for maximizing reach at these times`,

    'Trending Topics': `${modeInstruction}
${nicheContext}

Suggest 5 trending topics in the ${niche} niche right now.

Requirements:
- Explain why each topic is trending
- Provide 2-3 content angles for each topic
- Suggest the best format for each (reel, carousel, story, etc.)
- Include relevant hashtags for each topic
- Rate the virality potential (Low/Medium/High)
- Number each topic clearly`,
  };

  return prompts[tool];
}

export async function generateContent(
  tool: Tool,
  niche: Niche,
  mode: Mode,
  userInput: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  const prompt = getToolPrompt(tool, niche, mode, userInput);

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error('Empty response from Gemini');
  }

  return text;
}
