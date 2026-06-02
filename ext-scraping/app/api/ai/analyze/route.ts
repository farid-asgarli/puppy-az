import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getLookupData } from '@/lib/puppy-api';

const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini'; // 'gemini' | 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const gemini = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

async function callOpenAI(systemPrompt: string, userMessage: string): Promise<string> {
  if (!openai) throw new Error('OPENAI_API_KEY not configured');
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });
  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error('No AI response from OpenAI');
  return content;
}

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  if (!gemini) throw new Error('GEMINI_API_KEY not configured');
  // Try models in order: 2.0-flash, 1.5-flash, 2.0-flash-lite
  const models = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-2.0-flash-lite'];
  let lastError: Error | null = null;

  for (const modelName of models) {
    try {
      const model = gemini.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json',
        },
      });
      const result = await model.generateContent(`${systemPrompt}\n\n${userMessage}`);
      const content = result.response.text();
      if (!content) continue;
      return content;
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      // If it's a 429 quota error, try next model
      if (lastError.message.includes('429')) continue;
      throw lastError;
    }
  }
  throw lastError ?? new Error('All Gemini models failed');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, region, properties } = body as {
      title: string;
      description: string | null;
      price: number | null;
      region: string;
      properties: { name: string; value: string }[];
    };

    const lookup = await getLookupData();

    const systemPrompt = `You are an expert at analyzing pet advertisements from tap.az (Azerbaijan) and mapping them to structured data for puppy.az.

Given an ad's title, description, properties, and region, analyze and extract the following fields. Use the provided lookup data to map to exact IDs where possible.

AVAILABLE CATEGORIES (id → title):
${lookup.categories.map((c) => `${c.id}: ${c.title}`).join('\n')}

AVAILABLE BREEDS (id → title [categoryId]):
${lookup.breeds.map((b) => `${b.id}: ${b.title} [cat:${b.categoryId}]`).join('\n')}

AVAILABLE CITIES (id → name):
${lookup.cities.map((c) => `${c.id}: ${c.name}`).join('\n')}

AVAILABLE COLORS:
${lookup.colors.map((c) => `${c.name}`).join(', ')}

AD TYPES: 1=Sale, 2=Match, 3=Found, 4=Lost, 5=Owning
GENDERS: 0=Unknown, 1=Male, 2=Female
SIZES: 1=ExtraSmall, 2=Small, 3=Medium, 4=Large, 5=ExtraLarge

Rules:
- For categoryId and breedId, match based on title/description keywords to the closest available option
- For cityId, match the region text to the closest city name
- For color, pick the closest available color name
- For gender, look for keywords like "erkək"(male), "dişi"(female) in Azerbaijani
- For age, look for age mentions and convert to months (e.g., "2 yaş" = 24 months, "3 aylıq" = 3 months)
- For adType, most animals on tap.az are for Sale (1), unless description says otherwise
- For size, estimate based on breed if identifiable, or description cues
- For price, use the provided price value
- Title should be cleaned up and made more descriptive for puppy.az
- Description should be the original description or a cleaned-up version

Respond with ONLY valid JSON matching this schema:
{
  "title": "string",
  "description": "string",
  "ageInMonths": number | null,
  "gender": number | null,
  "adType": number,
  "color": "string",
  "weight": number | null,
  "size": number | null,
  "price": number,
  "cityId": number | null,
  "petBreedId": number | null,
  "petCategoryId": number | null,
  "confidence": {
    "category": "high" | "medium" | "low",
    "breed": "high" | "medium" | "low",
    "city": "high" | "medium" | "low",
    "gender": "high" | "medium" | "low",
    "age": "high" | "medium" | "low"
  },
  "reasoning": "brief explanation of analysis"
}`;

    const userMessage = `Analyze this tap.az pet ad:

TITLE: ${title}
PRICE: ${price != null ? `${price} AZN` : 'Negotiable'}
REGION: ${region}
PROPERTIES: ${properties.map((p) => `${p.name}: ${p.value}`).join(', ')}
DESCRIPTION: ${description || 'No description provided'}`;

    const content = AI_PROVIDER === 'openai' ? await callOpenAI(systemPrompt, userMessage) : await callGemini(systemPrompt, userMessage);

    const analysis = JSON.parse(content);

    return NextResponse.json({
      analysis,
      lookup: {
        categories: lookup.categories,
        breeds: lookup.breeds,
        cities: lookup.cities,
        colors: lookup.colors.map((c) => c.name),
        adTypes: lookup.adTypes,
      },
    });
  } catch (err) {
    console.error('AI analyze error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Analysis failed' }, { status: 500 });
  }
}
