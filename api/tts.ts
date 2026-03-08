import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

// ---------- Rate limiting (same pattern as chat) ----------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 10; // TTS is heavier, tighter limit
const RATE_LIMIT_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
        return false;
    }
    entry.count++;
    return entry.count > RATE_LIMIT_MAX;
}

const MAX_TEXT_LENGTH = 5000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
    if (isRateLimited(ip)) {
        return res.status(429).json({ error: 'Trop de requêtes audio. Gérard a la gorge sèche.' });
    }

    const { text } = req.body || {};

    if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Texte requis.' });
    }

    if (text.length > MAX_TEXT_LENGTH) {
        return res.status(400).json({ error: `Texte trop long (max ${MAX_TEXT_LENGTH} caractères).` });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('GEMINI_API_KEY is not configured');
        return res.status(500).json({ error: 'Configuration serveur manquante.' });
    }

    try {
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-tts',
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: ['AUDIO' as any],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                },
            },
        });

        const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;

        if (!inlineData?.data || !inlineData?.mimeType) {
            return res.status(500).json({ error: 'Pas de réponse audio.' });
        }

        return res.status(200).json({ data: inlineData.data, mimeType: inlineData.mimeType });
    } catch (error: any) {
        console.error('Gemini TTS error:', error?.message || error);
        return res.status(500).json({ error: 'Impossible de générer l\'audio.' });
    }
}
