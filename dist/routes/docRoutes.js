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
    .post(authMiddleware_1.protect, documentController_1.createDocument)
    .get(authMiddleware_1.protect, documentController_1.getAllDocuments);
router.route('/:id')
    .get(authMiddleware_1.protect, documentController_1.getDocument)
    .put(authMiddleware_1.protect, documentController_1.updateDocument)
    .delete(authMiddleware_1.protect, documentController_1.deleteDocument); // Delete endpoint
router.route('/:id/rename')
    .put(authMiddleware_1.protect, documentController_1.renameDocument); // Rename endpoint
exports.default = router;
