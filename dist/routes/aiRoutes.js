"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aiController_1 = require("../controllers/aiController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/grammar', authMiddleware_1.protect, aiController_1.handleGrammarCheck);
router.post('/summarize', authMiddleware_1.protect, aiController_1.handleSummarize);
exports.default = router;
