"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocument = exports.renameDocument = exports.deleteDocument = exports.getAllDocuments = exports.getDocument = exports.createDocument = void 0;
const Document_1 = __importDefault(require("../models/Document"));
const createDocument = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { title } = req.body;
        const docData = {
            title: title || 'Untitled',
            data: '',
            owner: req.user._id,
            collaborators: []
        };
        if (req.body._id)
            docData._id = req.body._id;
        const document = await Document_1.default.create(docData);
        res.status(201).json(document);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createDocument = createDocument;
const getDocument = async (req, res) => {
    try {
        // Validation removed to support custom UUIDs
        const document = await Document_1.default.findById(req.params.id);
        if (document) {
            res.json(document);
        }
        else {
            res.status(404).json({ message: 'Document not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDocument = getDocument;
const getAllDocuments = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        // Fetch ALL documents so everyone can access them (Public Shared Workspace)
        const documents = await Document_1.default.find({}).sort({ createdAt: -1 });
        res.json(documents);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllDocuments = getAllDocuments;
const deleteDocument = async (req, res) => {
    try {
        // Validation removed to support custom UUIDs
        const document = await Document_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDocument = deleteDocument;
const renameDocument = async (req, res) => {
    try {
        // Validation removed to support custom UUIDs
        const { title } = req.body;
        const document = await Document_1.default.findById(req.params.id);
        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
        // Owner or collaborator can rename? Let's say both.
        // For simplicity allow if user is found.
        document.title = title;
        await document.save();
        res.json(document);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.renameDocument = renameDocument;
// Update Document (Auto-save endpoint)
const updateDocument = async (req, res) => {
    try {
        // Validation removed to support custom UUIDs
        const { data } = req.body;
        const document = await Document_1.default.findByIdAndUpdate(req.params.id, { data });
        if (document) {
            res.json(document);
        }
        else {
            res.status(404).json({ message: 'Document not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateDocument = updateDocument;
