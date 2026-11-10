import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({ status: 'ok', hasApiKey: hasKey });
});

// Story generation endpoint
app.post('/api/stories/generate', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      genre = 'Fantasy',
      length = 'Medium',
      characters = [],
      language = 'English',
      style = 'Epic & Mythological',
    } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      res.status(400).json({ error: 'Please provide a story idea or topic.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured in Settings > Secrets.',
      });
      return;
    }

    const lengthGuide =
      length === 'Short'
        ? 'around 300-450 words total'
        : length === 'Long'
        ? 'around 900-1400 words total, richly detailed'
        : 'around 550-800 words total with vivid scenes';

    const charactersContext = Array.isArray(characters) && characters.length > 0
      ? `Main Characters to include: ${characters.map((c: any) => typeof c === 'string' ? c : `${c.name || 'Hero'} (${c.role || c.trait || ''})`).join(', ')}`
      : 'Create fitting, memorable characters that match the genre.';

    const systemInstruction = `You are a master fiction author and world-class storyteller.
Your task is to write a captivating, completely original story based on the user's idea.
Requirements:
1. Genre: ${genre}.
2. Tone & Style: ${style}.
3. Language: Write the entire story (title, beginning, middle, ending, summary, moralOrTheme) in ${language}.
4. Target Length: ${lengthGuide}.
5. Character inclusion: ${charactersContext}.
6. Structure the story into 3 distinct, compelling narrative movements:
   - "beginning": sets the atmospheric world, introduces characters, establishes stakes and inciting event.
   - "middle": rising action, tension, unexpected hurdles, character choices.
   - "ending": satisfying climax, emotional resonance, and closure.
7. Craft an irresistible, poetic or striking title.
8. Provide a vivid illustration prompt suitable for an artistic book cover or concept art.`;

    const userPrompt = `Story Idea: "${prompt.trim()}"
Genre: ${genre}
Writing Style: ${style}
Length: ${length}
Language: ${language}

Generate the complete structured story with all required sections.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Attractive, evocative story title' },
            genre: { type: Type.STRING, description: 'Story genre' },
            summary: { type: Type.STRING, description: 'One-paragraph hook or back-cover synopsis' },
            beginning: { type: Type.STRING, description: 'Beginning act: world setup, characters, and inciting incident' },
            middle: { type: Type.STRING, description: 'Middle act: rising conflict, trials, and turning point' },
            ending: { type: Type.STRING, description: 'Ending act: dramatic climax and resolution' },
            moralOrTheme: { type: Type.STRING, description: 'Core thematic insight or emotional takeaway' },
            keyCharacters: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of key character names with short descriptive descriptor',
            },
            illustrationPrompt: {
              type: Type.STRING,
              description: 'Rich scenic visual art prompt depicting the most memorable moment of this story',
            },
          },
          required: ['title', 'summary', 'beginning', 'middle', 'ending', 'moralOrTheme', 'illustrationPrompt'],
        },
      },
    });

    const rawJson = (response.text ?? '{}').trim();
    const storyData = JSON.parse(rawJson);

    // Compute metrics
    const fullText = `${storyData.beginning}\n\n${storyData.middle}\n\n${storyData.ending}`;
    const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length;
    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    res.json({
      ...storyData,
      id: `story_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      lengthSetting: length,
      style,
      language,
      wordCount,
      readingTimeMinutes,
    });
  } catch (err: any) {
    console.error('Error in /api/stories/generate:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate story with Gemini AI. Please try again.',
    });
  }
});

// Continue story endpoint
app.post('/api/stories/continue', async (req: Request, res: Response) => {
  try {
    const {
      existingStory,
      title = 'Original Story',
      continuationDirection = 'Unexpected plot twist and rising stakes',
      genre = 'Adventure',
      style = 'Consistent with previous style',
      language = 'English',
    } = req.body;

    if (!existingStory || typeof existingStory !== 'string' || !existingStory.trim()) {
      res.status(400).json({ error: 'Please provide the existing story to continue.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured in Settings > Secrets.',
      });
      return;
    }

    const systemInstruction = `You are an expert novelist continuing a gripping narrative.
Follow these rules:
1. Maintain strict consistency with the existing characters, voice, tone, lore, and unresolved plot hooks.
2. Advance the plot organically following the user's requested direction: "${continuationDirection}".
3. Write a rich, seamless next chapter (approx 400-700 words).
4. Provide a chapter title, the continuation content, and a tantalizing next-hook question.
5. Write in ${language}.`;

    const userPrompt = `Existing Story (or previous chapters):
"""
${existingStory.trim().slice(-4000)}
"""

Requested Continuation Direction:
${continuationDirection}

Genre: ${genre}
Style: ${style}

Generate the next continuation chapter in structured JSON format.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            chapterTitle: { type: Type.STRING, description: 'Title of this new continuation chapter' },
            continuationText: { type: Type.STRING, description: 'The seamless continuation narrative' },
            cliffhangerOrHook: { type: Type.STRING, description: 'A question or teaser for what lies ahead' },
            newDevelopments: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key plot or character developments introduced in this continuation',
            },
          },
          required: ['chapterTitle', 'continuationText', 'cliffhangerOrHook'],
        },
      },
    });

    const rawJson = (response.text ?? '{}').trim();
    const continuationData = JSON.parse(rawJson);

    const wordCount = continuationData.continuationText.trim().split(/\s+/).filter(Boolean).length;

    res.json({
      ...continuationData,
      timestamp: new Date().toISOString(),
      wordCount,
    });
  } catch (err: any) {
    console.error('Error in /api/stories/continue:', err);
    res.status(500).json({
      error: err.message || 'Failed to continue story. Please check inputs and try again.',
    });
  }
});

// Character generation endpoint
app.post('/api/characters/generate', async (req: Request, res: Response) => {
  try {
    const {
      genre = 'Fantasy',
      archetype = 'Any interesting archetype',
      setting = '',
      count = 1,
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured in Settings > Secrets.',
      });
      return;
    }

    const characterCount = Math.min(Math.max(1, Number(count) || 1), 3);

    const systemInstruction = `You are a character designer for acclaimed novels and screenplays.
Create ${characterCount} vivid, nuanced original characters suited for the genre: "${genre}".
Archetype or theme: "${archetype}".
${setting ? `Setting Context: "${setting}"` : ''}

Ensure each character has:
- A memorable full name and epithet/title.
- An evocative 1-line hook/tagline.
- Physical appearance and signature mannerism.
- 3 to 4 distinct personality traits (both strengths and flaws).
- An intriguing backstory / origin.
- Core motivation (what drives them).
- A hidden secret, flaw, or inner conflict.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate ${characterCount} detailed characters for genre: ${genre}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  title: { type: Type.STRING, description: 'e.g. The Reluctant Cartographer' },
                  tagline: { type: Type.STRING, description: 'One-sentence essence of the character' },
                  appearance: { type: Type.STRING, description: 'Distinct physical features and attire' },
                  personalityTraits: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  background: { type: Type.STRING, description: 'Origin and past experiences' },
                  motivation: { type: Type.STRING, description: 'What they want more than anything' },
                  secretOrFlaw: { type: Type.STRING, description: 'Hidden vulnerability or secret' },
                  signatureQuote: { type: Type.STRING, description: 'A line they might say' },
                },
                required: [
                  'name',
                  'title',
                  'tagline',
                  'appearance',
                  'personalityTraits',
                  'background',
                  'motivation',
                  'secretOrFlaw',
                ],
              },
            },
          },
          required: ['characters'],
        },
      },
    });

    const rawJson = (response.text ?? '{}').trim();
    const data = JSON.parse(rawJson);

    res.json(data);
  } catch (err: any) {
    console.error('Error in /api/characters/generate:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate character with Gemini AI.',
    });
  }
});

// Story illustration endpoint
app.post('/api/stories/illustrate', async (req: Request, res: Response) => {
  try {
    const { storyTitle, sceneDescription, style = 'Digital Fantasy Concept Art' } = req.body;

    if (!sceneDescription && !storyTitle) {
      res.status(400).json({ error: 'Please provide a story scene description to illustrate.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error: 'Gemini API key is not configured in Settings > Secrets.',
      });
      return;
    }

    const visualPrompt = `Masterpiece cinematic illustration for the story "${storyTitle || 'Tale'}": ${sceneDescription}. Art style: ${style}, ethereal lighting, rich colors, intricate details, atmospheric mood, 8k wallpaper quality.`;

    // Try generating with gemini-3.1-flash-lite-image
    try {
      const imageGenResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: visualPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      });

      let imageUrl: string | null = null;
      for (const part of imageGenResponse.candidates?.[0]?.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          imageUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        res.json({
          success: true,
          imageUrl,
          prompt: visualPrompt,
          isAiRendered: true,
        });
        return;
      }
    } catch (imageErr: any) {
      console.warn('Direct image generation unavailable or requires paid key, generating rich concept visual:', imageErr.message);
    }

    // Fallback: Generate detailed visual scene concept with color palette & visual composition
    const conceptResponse = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Design an exquisite illustration concept for the story "${storyTitle}": "${sceneDescription}".`,
      config: {
        systemInstruction: `You are an art director for a prestigious publishing house. Describe an illustration concept including focal point, background elements, lighting style, color palette hex codes, and emotional mood.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artDirection: { type: Type.STRING },
            focalPoint: { type: Type.STRING },
            lighting: { type: Type.STRING },
            palette: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Array of 4-5 hex colors like ["#1A103C", "#7C3AED", "#38BDF8", "#F59E0B"]',
            },
            mood: { type: Type.STRING },
          },
          required: ['artDirection', 'focalPoint', 'lighting', 'palette', 'mood'],
        },
      },
    });

    const conceptData = JSON.parse(conceptResponse.text || '{}');

    res.json({
      success: true,
      imageUrl: null,
      concept: conceptData,
      prompt: visualPrompt,
      isAiRendered: false,
    });
  } catch (err: any) {
    console.error('Error in /api/stories/illustrate:', err);
    res.status(500).json({
      error: err.message || 'Failed to craft story illustration.',
    });
  }
});

// Setup Vite middleware in dev or serve dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AI Story Creator server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
