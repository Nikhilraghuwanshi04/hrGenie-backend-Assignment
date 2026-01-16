import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

// Initialize OpenAI. We fallback to GEMINI_API_KEY because the user 
// pasted their OpenAI key into that variable in the .env file.
const apiKey = process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey,
});

export const checkGrammar = async (text: string): Promise<string> => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful grammar assistant." },
                { role: "user", content: `Fix the grammar and spelling in the following text, and return ONLY the corrected text without any introductory quotes or labels: "${text}"` }
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content || text;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to process grammar check");
    }
};

export const summarizeText = async (text: string): Promise<string> => {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: `Summarize the following text in a concise paragraph: "${text}"` }
            ],
            model: "gpt-3.5-turbo",
        });
        return completion.choices[0].message.content || text;
    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("Failed to summarize text");
    }
};
