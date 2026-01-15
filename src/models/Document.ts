import mongoose, { Document, Schema } from 'mongoose';

export interface IDocument extends Omit<Document, '_id'> {
    _id: string; // Explicitly define _id as string for easier usage
    title: string;
    data: Object; // Store Delta or content
    owner: mongoose.Schema.Types.ObjectId;
    collaborators: mongoose.Schema.Types.ObjectId[];
}

const DocumentSchema: Schema = new Schema(
    {
        _id: { type: String, required: true }, // Using custom ID (docId) or let MongoDB generate one? 
        // Usually for collab editors we might want a friendly URL id, but UUID or Mongo ID is fine.
        // Let's stick to simple Mongo ID for now, OR let the user pass an ID (like a room name).
        // The requirement says "Each documentId should be a room". 
        // Let's use string _id to allow flexible IDs if needed, otherwise Mongo ObjectId.
        // Actually, to make "joining rooms" easier with URLs, a custom string ID is nice.
        // But for simplicity, I'll use the default _id, but access it as string.

        title: { type: String, required: true, default: 'Untitled Document' },
        data: { type: Object, default: '' }, // Quill uses Delta (JSON), so Object is good.
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Doc = mongoose.model<IDocument>('Document', DocumentSchema);
export default Doc;
