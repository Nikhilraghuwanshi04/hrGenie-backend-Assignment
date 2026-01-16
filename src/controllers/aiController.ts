import { Request, Response } from 'express';
import { checkGrammar, summarizeText } from '../services/aiService';

export const handleGrammarCheck = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }
        const correctedText = await checkGrammar(text);
        res.json({ correctedText });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const handleSummarize = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }
        const summary = await summarizeText(text);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
