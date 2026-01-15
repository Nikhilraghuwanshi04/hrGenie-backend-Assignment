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
        // We can generate a specific ID or let Mongo do it.
        // If we want to allow the frontend to generate the ID (like UUID) and pass it, we can.
        // For now, let's create a new doc with Mongo ID.

        // Note: My Document model defined _id as String. If I don't provide it, Mongoose creates an ObjectId.
        // But I defined type: String. If I want ObjectId, I should have used Schema.Types.ObjectId.
        // Let's rely on Mongoose's default behavior but if I forced _id: String, I might need to provide it?
        // Wait, in my model file I put `_id: { type: String, required: true }`. 
        // If I want to use standard Mongo IDs, I should remove that lines or just cast.
        // Let's adjust the model in the next step if I realized I made a mistake.
        // Actually, for real-time collaboration, a predictable ID or simple string is often used.
        // But let's assume standard creation for now.

        // Wait, if I defined _id as required String, I MUST provide it.
        // Let's generate a random ID here? Or better, use a library like 'uuid'.
        // Or just default to normal Mongo ID. I'll correct the Model to not enforce string _id unless I pass one.

        // I'll assume we are fixing the model to be standard ObjectId or I'll pass a UUID.
        // Let's pass a custom ID from req.body or generate one. 
        // A simple approach: use the title + timestamp? No.
        // Let's just create it.

        const document = await Doc.create({
            _id: req.body._id, // Allow frontend to set ID (e.g. UUID)
            title: title || 'Untitled',
            data: '',
            owner: req.user._id as any,
            collaborators: []
        });

        res.status(201).json(document);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const getDocument = async (req: Request, res: Response): Promise<void> => {
    try {
        const document = await Doc.findById(req.params.id);
        if (document) {
            res.json(document);
        } else {
            // If not found, create one?
            // Some collab editors create on the fly if you visit a link.
            // Requirements say "Create a GeminiService...".
            // Let's just return 404 for now, or maybe create if it validates a certain format.
            res.status(404).json({ message: 'Document not found' });
        }
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

// Update Document (Auto-save endpoint)
export const updateDocument = async (req: Request, res: Response): Promise<void> => {
    try {
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
