import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import * as positionService from "../services/positionService.js";

// @desc    Get all positions for the authenticated user
// @route   GET /api/positions
// @access  Private
export const getAllPositions = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    try {
        const positions = await positionService.fetchPositionsWithPnl(userId);
        return res.status(200).json(positions);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Add a new position for the authenticated user
// @route   POST /api/positions
// @access  Private
export const addPosition = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { symbol, quantity, averagePrice } = req.body;

    if (!symbol || !quantity || !averagePrice) {
        return res.status(400).json({ message: 'Symbol, quantity, and averagePrice are required' });
    }

    try {
        const newPosition = await positionService.addPosition(userId, { symbol, quantity, averagePrice });
        return res.status(201).json(newPosition);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: (error as Error).message });
    }   
};

// @desc    Update an existing position for the authenticated user
// @route   PUT /api/positions/:symbol
// @access  Private
export const updatePosition = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { symbol } = req.params;
    const { quantity, averagePrice } = req.body;

    if (!symbol || !quantity || !averagePrice) {
        return res.status(400).json({ message: 'Symbol, quantity, and averagePrice are required' });
    }

    try {
        const updatedPosition = await positionService.updatePosition(userId, { symbol, quantity, averagePrice });
        return res.json(updatedPosition);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: (error as Error).message });
    }
};

// @desc    Remove a position for the authenticated user
// @route   DELETE /api/positions/:symbol
// @access  Private
export const deletePosition = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { symbol } = req.params;

    if (!symbol) {
        return res.status(400).json({ message: 'Symbol is required' });
    }

    try {
        await positionService.deletePosition(userId, symbol);
        return res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: (error as Error).message });
    }
};
