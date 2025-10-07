import express from 'express';
import { initializePrisma } from './utils/prisma.js';
import authRoutes from './routes/authRoutes.js';

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

export default app;