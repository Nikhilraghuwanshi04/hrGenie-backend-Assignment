import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import aiRoutes from './routes/aiRoutes';
import authRoutes from './routes/authRoutes';
import docRoutes from './routes/docRoutes';

const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/documents', docRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
    res.send('Collaborative Editor API is running...');
});

export default app;
