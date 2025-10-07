import { type Response } from "express";
import { type AuthRequest } from "../middleware/authMiddleware.js";
import *  as watchlistItemService from "../services/watchlistItemService.js";

// @desc    Get all watchlist items for a user
// @route   GET /api/watchlist
// @access  Private
export const getWatchlistItems = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    try {
        const watchlist = await watchlistItemService.getWatchlistItem(userId);
        res.status(200).json(watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get watchlist items' });
    } 
}

// @desc    Add a watchlist item for a user
// @route   POST /api/watchlist
// @access  Private
export const addWatchlistItem = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    // will check if symbol is valid in the future (not now xD)
    const { symbol } = req.body;
    if (!symbol) {
        return res.status(400).json({ message: 'Symbol is required' });
    }
    try {
        const newItem = await watchlistItemService.addWatchlistItem(userId, symbol);
        res.status(201).json(newItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add watchlist item' });
    }
}

// @desc    Remove a watchlist item for a user
// @route   DELETE /api/watchlist/:symbol
// @access  Private
export const removeWatchlistItem = async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { symbol } = req.params;
    if (!symbol) {
        return res.status(400).json({ message: 'Symbol is required' });
    }
    try {
        const deletedItem = await watchlistItemService.removeWatchlistItem(userId, symbol);
        res.status(200).json(deletedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove watchlist item' });
    }
}