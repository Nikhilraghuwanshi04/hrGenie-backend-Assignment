import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Doc from '../models/Document';

export const createDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { title } = req.body;

        const docData: any = {
            title: title || 'Untitled',
            data: '',
            owner: req.user!._id,
            collaborators: []
        };
        if (req.body._id) docData._id = req.body._id;

        const document = await Doc.create(docData);

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation removed to support custom UUIDs
        const document = await Doc.findById(req.params.id);
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getAllDocuments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // Fetch ALL documents so everyone can access them (Public Shared Workspace)
        const documents = await Doc.find({}).sort({ createdAt: -1 });

        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validation removed to support custom UUIDs
        const document = await Doc.findById(req.params.id);
        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        // Only owner can delete - DISABLED for Public Workspace mode
        // if (String(document.owner) !== String(req.user!._id)) {
        //     res.status(401).json({ message: 'Not authorized to delete this document' });
        //     return;
        // }

        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const renameDocument = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validation removed to support custom UUIDs
        const { title } = req.body;
        const document = await Doc.findById(req.params.id);

        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }

        // Owner or collaborator can rename? Let's say both.
        // For simplicity allow if user is found.
        document.title = title;
        await document.save();
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update Document (Auto-save endpoint)
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation removed to support custom UUIDs
        const { data } = req.body;
        const document = await Doc.findByIdAndUpdate(req.params.id, { data });
        if (document) {
            res.json(document);
        } else {
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
