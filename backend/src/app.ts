import express from 'express';
import { initializePrisma } from './utils/prisma.js';
import authRoutes from './routes/authRoutes.js';
import watchlistItemRoutes from './routes/watchlistItemRoutes.js';
import positionRoutes from './routes/positionRoutes.js';

initializePrisma();

const app = express();

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// test route
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Hello World!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/watchlist', watchlistItemRoutes);
app.use('/api/positions', positionRoutes);

export default app;