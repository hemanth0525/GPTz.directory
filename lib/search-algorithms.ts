import { GPT } from './types';

interface TermFrequency {
    [term: string]: number;
}

interface InverseDocumentFrequency {
    [term: string]: number;
}

interface TfIdfVector {
    [term: string]: number;
}

let documentVectors: { [gptId: string]: TfIdfVector } = {};
let idf: InverseDocumentFrequency = {};
let vocabulary: Set<string> = new Set();

// Improved tokenization with better word boundary handling and common variations
function tokenize(text: string): string[] {
    // Convert to lowercase and replace special characters with spaces
    const normalized = text.toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    // Split into words
    const words = normalized.split(' ');

    // Generate variations for common terms
    const variations: string[] = [];
    words.forEach(word => {
        variations.push(word);
        // Add common variations (e.g., singular/plural, -ing forms)
        if (word.endsWith('s')) variations.push(word.slice(0, -1));
        if (word.endsWith('ing')) variations.push(word.slice(0, -3));
        if (word.endsWith('ed')) variations.push(word.slice(0, -2));
    });

    return variations;
}

function computeTermFrequency(tokens: string[]): TermFrequency {
    const tf: TermFrequency = {};
    for (const token of tokens) {
        tf[token] = (tf[token] || 0) + 1;
    }
    return tf;
}

function computeInverseDocumentFrequency(gpts: GPT[]): void {
    const documentFrequency: { [term: string]: number } = {};
    const N = gpts.length;

    // First pass: compute document frequencies
    for (const gpt of gpts) {
        const uniqueTerms = new Set(tokenize(getDocumentText(gpt)));
        for (const term of uniqueTerms) {
            documentFrequency[term] = (documentFrequency[term] || 0) + 1;
            vocabulary.add(term);
        }
    }

    // Second pass: compute IDF with smoothing
    for (const term in documentFrequency) {
        // Modified IDF calculation with smoothing
        idf[term] = Math.log((N + 1) / (documentFrequency[term] + 0.5));
    }
}

function computeTfIdfVector(tf: TermFrequency): TfIdfVector {
    const vector: TfIdfVector = {};
    for (const term in tf) {
        // BM25-inspired term frequency saturation
        const termFreq = tf[term];
        const saturatedTf = (termFreq * (1.2 + 1)) / (termFreq + 1.2);
        vector[term] = saturatedTf * (idf[term] || 0);
    }
    return vector;
}

function getDocumentText(gpt: GPT): string {
    // Weight different fields differently by repeating important fields
    return [
        gpt.name.repeat(3),  // Name is most important
        gpt.shortDescription.repeat(2),  // Short description is second most important
        gpt.longDescription,
        gpt.category.repeat(2),
        ...gpt.tags.map(tag => tag.repeat(2))  // Tags are important
    ].join(' ');
}

export function precomputeVectors(gpts: GPT[]): void {
    computeInverseDocumentFrequency(gpts);
    for (const gpt of gpts) {
        const tokens = tokenize(getDocumentText(gpt));
        const tf = computeTermFrequency(tokens);
        documentVectors[gpt.id] = computeTfIdfVector(tf);
    }
}

function cosineSimilarity(vec1: TfIdfVector, vec2: TfIdfVector): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    // Calculate using all terms from both vectors
    const allTerms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);

    for (const term of allTerms) {
        const v1 = vec1[term] || 0;
        const v2 = vec2[term] || 0;
        dotProduct += v1 * v2;
        norm1 += v1 * v1;
        norm2 += v2 * v2;
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2) || 1);
    return isNaN(similarity) ? 0 : similarity;
}

function calculateExactMatchBonus(query: string, gpt: GPT): number {
    const queryLower = query.toLowerCase();
    const bonus =
        (gpt.name.toLowerCase().includes(queryLower) ? 0.3 : 0) +
        (gpt.shortDescription.toLowerCase().includes(queryLower) ? 0.2 : 0) +
        (gpt.tags.some(tag => tag.toLowerCase().includes(queryLower)) ? 0.2 : 0) +
        (gpt.category.toLowerCase().includes(queryLower) ? 0.1 : 0);
    return bonus;
}

export function computeRelevanceScores(query: string, gpts: GPT[]): { gpt: GPT; score: number }[] {
    if (Object.keys(documentVectors).length === 0) {
        precomputeVectors(gpts);
    }

    const queryTokens = tokenize(query);
    const queryTf = computeTermFrequency(queryTokens);
    const queryVector = computeTfIdfVector(queryTf);

    const scores = gpts.map(gpt => {
        const baseScore = cosineSimilarity(queryVector, documentVectors[gpt.id]);
        const exactMatchBonus = calculateExactMatchBonus(query, gpt);
        const finalScore = Math.min(1, baseScore + exactMatchBonus);

        return {
            gpt,
            score: finalScore
        };
    });

    return scores.sort((a, b) => b.score - a.score);
}

function generateReason(query: string, gpt: GPT, score: number): string {
    const reasons: string[] = [];
    const queryLower = query.toLowerCase();

    // Check for exact matches first
    if (gpt.name.toLowerCase().includes(queryLower)) {
        reasons.push(`Direct match in name: ${gpt.name}`);
    }
    if (gpt.tags.some(tag => tag.toLowerCase().includes(queryLower))) {
        const matchingTags = gpt.tags
            .filter(tag => tag.toLowerCase().includes(queryLower));
        reasons.push(`Matching tags: ${matchingTags.join(', ')}`);
    }
    if (gpt.shortDescription.toLowerCase().includes(queryLower)) {
        reasons.push('Matches your needs based on description');
    }

    // Add relevance description based on normalized score
    if (score > 0.8) reasons.push("Exceptionally high relevance to your query");
    else if (score > 0.6) reasons.push("Very high relevance to your query");
    else if (score > 0.4) reasons.push("High relevance to your query");
    else if (score > 0.2) reasons.push("Good relevance to your query");
    else reasons.push("Moderate relevance to your query");

    return reasons.join('. ') + '.';
}

export function getTopNGPTs(query: string, gpts: GPT[], n: number): { gpt: GPT; score: number; reason: string }[] {
    const rankedGPTs = computeRelevanceScores(query, gpts);

    // Normalize scores relative to the top score to ensure we get a good spread
    const topScore = rankedGPTs[0]?.score || 1;

    return rankedGPTs
        .slice(0, n)
        .map(({ gpt, score }) => ({
            gpt,
            score: Math.min(1, score / (topScore * 0.8)), // Normalize and scale up slightly
            reason: generateReason(query, gpt, score)
        }));
}

export function updateIndex(gpts: GPT[]): void {
    documentVectors = {};
    idf = {};
    vocabulary = new Set();
    precomputeVectors(gpts);
}

export function clearIndex(): void {
    documentVectors = {};
    idf = {};
    vocabulary = new Set();
}

export function getSearchSuggestions(partialQuery: string, gpts: GPT[], maxSuggestions: number = 5): string[] {
    const scores = computeRelevanceScores(partialQuery, gpts);
    return scores.slice(0, maxSuggestions).map(result => result.gpt.name);
}

export function searchSpecificFields(query: string, gpts: GPT[], fields: (keyof GPT)[], maxResults: number = 10): GPT[] {
    const fieldGpts = gpts.map(gpt => ({
        ...gpt,
        searchText: fields.map(field => gpt[field]).join(' ')
    }));

    const scores = computeRelevanceScores(query, fieldGpts);
    return scores.slice(0, maxResults).map(result => result.gpt);
}

export function getRelatedGPTs(gpt: GPT, allGpts: GPT[], maxResults: number = 5): GPT[] {
    const query = `${gpt.tags.join(' ')} ${gpt.category}`;
    const scores = computeRelevanceScores(query, allGpts.filter(g => g.id !== gpt.id));
    return scores.slice(0, maxResults).map(result => result.gpt);
}

