"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSummarize = exports.handleGrammarCheck = void 0;
const geminiService_1 = require("../services/geminiService");
const handleGrammarCheck = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }
        const correctedText = await (0, geminiService_1.checkGrammar)(text);
        res.json({ correctedText });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.handleGrammarCheck = handleGrammarCheck;
const handleSummarize = async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) {
            res.status(400).json({ message: 'Text is required' });
            return;
        }
        const summary = await (0, geminiService_1.summarizeText)(text);
        res.json({ summary });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.handleSummarize = handleSummarize;
