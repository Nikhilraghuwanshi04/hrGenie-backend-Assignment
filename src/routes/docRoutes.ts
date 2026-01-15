import express from 'express';
import { createDocument, getDocument, updateDocument } from '../controllers/documentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createDocument);

router.route('/:id')
    .get(protect, getDocument)
    .put(protect, updateDocument); // Basic persistence endpoint

export default router;
