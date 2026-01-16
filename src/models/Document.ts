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
        _id: { type: String, required: true, default: () => new mongoose.Types.ObjectId().toString() },
        // Using string _id allows UUIDs or ObjectIds. Default function ensures we always have an ID.

        title: { type: String, required: true, default: 'Untitled Document' },
        data: { type: Object, default: '' }, // Quill uses Delta (JSON), so Object is good.
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Ensure 'id' string is included in JSON
        toObject: { virtuals: true }
    }
);

const Doc = mongoose.model<IDocument>('Document', DocumentSchema);
export default Doc;
