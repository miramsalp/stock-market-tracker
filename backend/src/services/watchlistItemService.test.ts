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

    // Testcase 2 - addWatchlistItem throws error if item already exists
    it('addWatchlistItem - item already exists', async () => {
        (mockPrisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue(MOCK_NEW_ITEM as any); // Existing item
        await expect(addWatchlistItem(TEST_USER_ID, TEST_SYMBOL)).rejects.toThrow("Item already in watchlist");
        expect(mockPrisma.watchlistItem.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.watchlistItem.create).not.toHaveBeenCalled();
    });

    // Testcase 3 - getWatchlistItem retrieves items for a user
    it('getWatchlistItem - success', async () => {
        const MOCK_WATCHLIST = [MOCK_NEW_ITEM];
        (mockPrisma.watchlistItem.findMany as jest.Mock).mockResolvedValue(MOCK_WATCHLIST as any);
        const result = await getWatchlistItem(TEST_USER_ID);
        expect(mockPrisma.watchlistItem.findMany).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID },
        });
        expect(result).toEqual(MOCK_WATCHLIST);
    });

    // Testcase 4 - removeWatchlistItem successfully removes an item
    it('removeWatchlistItem - success', async () => {
        (mockPrisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue(MOCK_NEW_ITEM as any); // Existing item
        (mockPrisma.watchlistItem.delete as jest.Mock).mockResolvedValue(MOCK_NEW_ITEM as any);
        const result = await removeWatchlistItem(TEST_USER_ID, TEST_SYMBOL);
        expect(mockPrisma.watchlistItem.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.watchlistItem.delete).toHaveBeenCalledWith({
            where: { id: MOCK_NEW_ITEM.id },
        });
        expect(result).toEqual(MOCK_NEW_ITEM);
    });

    // Testcase 5 - removeWatchlistItem throws error if item not found
    it('removeWatchlistItem - item not found', async () => {
        (mockPrisma.watchlistItem.findFirst as jest.Mock).mockResolvedValue(null); // No existing item
        await expect(removeWatchlistItem(TEST_USER_ID, TEST_SYMBOL)).rejects.toThrow("Item not found in watchlist");
        expect(mockPrisma.watchlistItem.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.watchlistItem.delete).not.toHaveBeenCalled();
    });
});