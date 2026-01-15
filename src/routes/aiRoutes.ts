import express from 'express';
import { handleGrammarCheck, handleSummarize } from '../controllers/aiController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/grammar', protect, handleGrammarCheck);
router.post('/summarize', protect, handleSummarize);

export default router;
