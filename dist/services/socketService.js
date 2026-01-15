"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketService = (io) => {
    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);
        // Join a document room
        socket.on('join-document', (documentId) => {
            socket.join(documentId);
            console.log(`User ${socket.id} joined document ${documentId}`);
        });
        // Handle sending changes
        socket.on('send-changes', (delta, documentId) => {
            // Broadcast changes to everyone else in the room
            socket.to(documentId).emit('receive-changes', delta);
        });
        // Handle cursor position
        socket.on('cursor-changes', (range, documentId) => {
            socket.to(documentId).emit('receive-cursor', range, socket.id);
        });
        // Handle saving document (triggered by client, or we save periodic)
        socket.on('save-document', async (data) => {
            const { documentId, content } = data;
            // Assuming we have a way to access the model or controller
            // We should ideally import Doc model here
            try {
                // Dynamic import or moved import to top
                const Doc = require('../models/Document').default;
                await Doc.findByIdAndUpdate(documentId, { data: content });
                socket.emit('document-saved', { status: 'success' });
            }
            catch (e) {
                console.error('Error saving document:', e);
                socket.emit('document-saved', { status: 'error' });
            }
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};
exports.default = socketService;
