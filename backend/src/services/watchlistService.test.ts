import { describe } from "node:test";
import { prisma } from "../utils/prisma.js";
import { addWatchlistItem, getWatchlistItem, removeWatchlistItem } from "./watchlistItemService.js";
jest.mock('../utils/prisma.js'); 
const mockPrisma = prisma as jest.Mocked<typeof prisma>;
    
const TEST_USER_ID = 1;
const TEST_SYMBOL = "AaPl";
const MOCK_NEW_ITEM = { id: 1, userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() };

describe('WatchlistItemService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Testcase 1 - addWatchlistItem successfully adds a new item
    it('addWatchlistItem - success', async () => {
        (mockPrisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue(null); // No existing item
        (mockPrisma.watchlistItem.create as jest.Mock).mockResolvedValue(MOCK_NEW_ITEM as any);

        const result = await addWatchlistItem(TEST_USER_ID, TEST_SYMBOL);

        
        expect(mockPrisma.watchlistItem.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.watchlistItem.create).toHaveBeenCalledWith({
            data: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        // console.log(result)
        expect(result).toEqual(MOCK_NEW_ITEM);
    });
});