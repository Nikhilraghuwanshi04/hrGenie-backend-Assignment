"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route('/')
    .post(authMiddleware_1.protect, documentController_1.createDocument);
router.route('/:id')
    .get(authMiddleware_1.protect, documentController_1.getDocument)
    .put(authMiddleware_1.protect, documentController_1.updateDocument); // Basic persistence endpoint
exports.default = router;
