import * as authService from '../services/authService.js';
import { type Request, type Response } from 'express';
import { generateAuthToken } from '../utils/authUtil.js';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const newUser = await authService.registerUser(email, password);
        // generate token
        const token = generateAuthToken(newUser.id, newUser.email);
        res.status(201).json({ message: 'User registered successfully', userId: newUser.id, email: newUser.email, token: token });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Registration failed.' });
    }
}

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await authService.loginUser(email, password);
        const token = generateAuthToken(user.id, user.email);
        res.status(200).json({ message: 'Login successful', userId: user.id, email: user.email, token: token });
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Login failed.' });
    }   
}