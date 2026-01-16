import express from 'express';
import { createDocument, deleteDocument, getAllDocuments, getDocument, renameDocument, updateDocument } from '../controllers/documentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createDocument)
    .get(protect, getAllDocuments);

router.route('/:id')
    .get(protect, getDocument)
    .put(protect, updateDocument)
    .delete(protect, deleteDocument); // Delete endpoint

router.route('/:id/rename')
    .put(protect, renameDocument); // Rename endpoint

export default router;
