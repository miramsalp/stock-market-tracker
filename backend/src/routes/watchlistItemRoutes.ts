import { Router } from 'express';
import { getWatchlistItems, addWatchlistItem, removeWatchlistItem } from '../controllers/watchlistItemController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.route('/').get(getWatchlistItems).post(addWatchlistItem);
router.route('/:symbol').delete(removeWatchlistItem);

export default router;