import { promises as fs } from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { GPT } from '@/lib/types';
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { getTopNGPTs } from '@/lib/search-algorithms';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface AIResponse {
    recommendations: GPT[];
    isAIFallback: boolean;
}

export async function POST(request: NextRequest) {
    try {
        const { query } = await request.json();

        if (!query || query.length < 3 || query.length > 200) {
            return NextResponse.json({ error: "Invalid query length" }, { status: 400 });
        }

        const jsonPath = path.join(process.cwd(), 'public', 'gpts_live.json');
        const jsonData = await fs.readFile(jsonPath, 'utf8');
        const gptsData = JSON.parse(jsonData);
        const gpts = Object.entries(gptsData).map(([id, data]) => ({ ...data as GPT, id }));

        const response = await getAIRecommendations(query, gpts);

        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in ask-ai API route:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

async function getAIRecommendations(query: string, gpts: GPT[]): Promise<AIResponse> {
    const topGPTs = getTopNGPTs(query, gpts, 100);

    if (topGPTs.length === 0) {
        return { recommendations: [], isAIFallback: false };
    }

    const models: { name: string; model: GenerativeModel | null }[] = [
        { name: "gemini-2.0-flash-exp", model: null },
        { name: "gemini-1.5-pro", model: null }
    ];

    for (const modelConfig of models) {
        try {
            modelConfig.model = genAI.getGenerativeModel({ model: modelConfig.name });

            if (!modelConfig.model) {
                console.error(`Model ${modelConfig.name} could not be initialized. Trying next model.`);
                continue;
            }

            const prompt = `
You are a GPT recommendation system. Based on the user query, recommend relevant GPTs from our directory.

User Query: "${query}"

Available GPTs:
${JSON.stringify(topGPTs.map(({ gpt }) => gpt), null, 2)}

Provide recommendations in the following JSON structure (no markdown, no backticks, just pure JSON):
{
  "recommendations": [
    {
      "id": "gpt_id",
      "reason": "explanation",
      "confidence": 0.95
    }
  ]
}

Requirements:
- Return ONLY valid JSON
- Do not include any explanation text or markdown formatting
- Only recommend GPTs that exist in the provided list
- Ensure the confidence is at least 0.6
- Give it in the order of relevance and confidence level (highest first)
– Do not recommend the same GPT multiple times
- Return empty array if no recommendations are found or query is invalid
- Ensure each recommendation has all required fields
- Also check the tags and description for relevance
- Recommend all GPTs that are relevant to the query
- Understand the user query and provide relevant recommendations even if they are not exact matches or have typos or synonyms or related terms or concepts or ideas
- Confidence should be between 0 and 1
- Ensure each recommendation has all required fields
- Ensure you don't address the user as user just say your ( for eg: instead of saying "Based on the user query" say "Based on your query", so you are directly interacting with the user )
`;

            const result = await modelConfig.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const cleanJson = text.replace(/\`\`\`json\s*|\s*\`\`\`/g, '').trim();

            interface AIRecommendation {
                id: string;
                reason: string;
                confidence: number;
            }

            const parsed = JSON.parse(cleanJson);

            const validRecommendations = parsed.recommendations
                .filter((rec: AIRecommendation) => rec.confidence >= 0.6)
                .map((rec: AIRecommendation) => {
                    const gptWithScore = topGPTs.find(({ gpt }) => gpt.id === rec.id);
                    if (!gptWithScore) return null;
                    return {
                        ...gptWithScore.gpt,
                        aiReason: rec.reason,
                        confidence: Math.min(1, Math.max(0, rec.confidence))
                    };
                })
                .filter(Boolean);

            return {
                recommendations: validRecommendations,
                isAIFallback: false
            };
        } catch (error) {
            console.error(`Error with model ${modelConfig.name}:`, error);
            if (modelConfig === models[models.length - 1]) {
                console.error("All models failed. Using fallback recommendations.");
                return getFallbackRecommendations(query, gpts);
            }
        }
    }

    return getFallbackRecommendations(query, gpts);
}

function getFallbackRecommendations(query: string, gpts: GPT[]): AIResponse {
    const newTopGPTs = getTopNGPTs(query, gpts, 10);
    return {
        recommendations: newTopGPTs
            .filter(({ score }) => score > 0)
            .map(({ gpt, score, reason }) => ({
                ...gpt,
                aiReason: reason,
                score
            })),
        isAIFallback: true
    };
}