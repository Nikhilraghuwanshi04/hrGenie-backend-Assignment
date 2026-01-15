import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const checkGrammar = async (text: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Fix the grammar and spelling in the following text, and return ONLY the corrected text: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

export const summarizeText = async (text: string): Promise<string> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following text in a concise paragraph: "${text}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
