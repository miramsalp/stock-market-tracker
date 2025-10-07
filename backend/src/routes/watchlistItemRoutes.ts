import { Router } from 'express';
import { getWatchlistItems, addWatchlistItem, removeWatchlistItem } from '../controllers/watchlistItemController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getWatchlistItems);
router.post('/', authenticateToken, addWatchlistItem);
router.delete('/:symbol', authenticateToken, removeWatchlistItem);

export default router;