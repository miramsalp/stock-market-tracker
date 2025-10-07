import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const generateAuthToken = (userId: number, email: string): string => {
    const payload = {
        userId: userId,
        email: email
    }
    // jwt -> header, payload, signature
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    return token;
}