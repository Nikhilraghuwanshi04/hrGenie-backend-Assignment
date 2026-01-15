"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeText = exports.checkGrammar = void 0;
const generative_ai_1 = require("@google/generative-ai");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const checkGrammar = async (text) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Fix the grammar and spelling in the following text, and return ONLY the corrected text: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
exports.checkGrammar = checkGrammar;
const summarizeText = async (text) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Summarize the following text in a concise paragraph: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};
exports.summarizeText = summarizeText;
