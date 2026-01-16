import { Server, Socket } from 'socket.io';

interface User {
    id: string; // Socket ID
    userId: string; // Database ID
    username?: string;
    documentId: string;
}

const users: User[] = [];

// Helper functions for Presence
const addUser = (id: string, documentId: string, userId: string, username?: string) => {
    const existingUser = users.find((user) => user.id === id);
    if (existingUser) return existingUser;

    const user = { id, documentId, userId, username: username || 'Anonymous' };
    users.push(user);
    return user;
};

const removeUser = (id: string) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUsersInRoom = (documentId: string) => {
    return users.filter((user) => user.documentId === documentId);
};

const socketService = (io: Server) => {
    io.on('connection', (socket: Socket) => {
        // console.log(`User connected: ${socket.id}`);

        // Join a document room
        socket.on('join-document', (documentId: string, username?: string, userId?: string) => {
            const user = addUser(socket.id, documentId, userId || 'unknown', username);

            socket.join(user.documentId);

            // Broadcast to room that a user joined
            // console.log(`${user.username} joined document ${user.documentId}`);

            // Send updated list of users in this room to ALL users in room
            io.to(user.documentId).emit('room-users', {
                room: user.documentId,
                users: getUsersInRoom(user.documentId)
            });
        });

        // Handle sending changes
        socket.on('send-changes', (delta, documentId) => {
            socket.to(documentId).emit('receive-changes', delta);
        });

        // Handle cursor position
        socket.on('cursor-changes', (range, documentId) => {
            socket.to(documentId).emit('receive-cursor', range, socket.id);
        });

        // Handle saving document (triggered by client, or we save periodic)
        socket.on('save-document', async (data) => {
            const { documentId, content } = data;
            try {
                const Doc = require('../models/Document').default;
                await Doc.findByIdAndUpdate(documentId, { data: content });
                socket.emit('document-saved', { status: 'success' });
            } catch (e) {
                console.error('Error saving document:', e);
                socket.emit('document-saved', { status: 'error' });
            }
        });

        socket.on('disconnect', () => {
            const user = removeUser(socket.id);
            if (user) {
                // console.log(`${user.username} left document ${user.documentId}`);
                io.to(user.documentId).emit('room-users', {
                    room: user.documentId,
                    users: getUsersInRoom(user.documentId)
                });
            }
        });
    });
};

export default socketService;
