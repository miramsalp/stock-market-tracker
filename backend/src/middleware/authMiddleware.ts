import { type Request, type Response, type NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface AuthRequest extends Request {
    userId?: number
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer & Token
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' });
    }
}