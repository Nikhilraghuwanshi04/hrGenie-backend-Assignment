import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDB();

import socketService from './services/socketService';

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

socketService(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export { io };
