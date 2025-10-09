import { prisma } from '../utils/prisma.js'; 
jest.mock('../utils/prisma'); 
const mockPrisma = prisma as jest.Mocked<typeof prisma>; 

import * as dataService from '../services/dataService.js';
jest.mock('../services/dataService');
const mockFetchStockPrice = dataService.fetchStockPrice as jest.Mock;

import { 
    addPosition, 
    updatePosition, 
    deletePosition, 
    getPositions, 
    fetchPositionsWithPnl 
} from './positionService.js';

const TEST_USER_ID = 1;
const TEST_SYMBOL = 'TSLA';
const TEST_QUANTITY = 10;
const TEST_AVG_PRICE = 300.00;

const MOCK_POSITION = { 
    id: 201, 
    userId: TEST_USER_ID, 
    symbol: TEST_SYMBOL, 
    quantity: TEST_QUANTITY, 
    averagePrice: TEST_AVG_PRICE,
};

describe('Position Service', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test Case 1: addPosition - successfully adds a new position
    it('should successfully add a new position', async () => {
        (mockPrisma.position.findFirst as jest.Mock).mockResolvedValue(null); // No existing position
        (mockPrisma.position.create as jest.Mock).mockResolvedValue(MOCK_POSITION as any);

        const inputData = { 
            symbol: TEST_SYMBOL.toLowerCase(), 
            quantity: TEST_QUANTITY, 
            averagePrice: TEST_AVG_PRICE 
        };
        const result = await addPosition(TEST_USER_ID, inputData);

        expect(mockPrisma.position.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        
        expect(mockPrisma.position.create).toHaveBeenCalledWith({
            data: { 
                ...inputData, 
                symbol: TEST_SYMBOL.toUpperCase(),
                userId: TEST_USER_ID 
            },
        });
        expect(result).toEqual(MOCK_POSITION);
    });

    // Test Case 2: updatePosition
    it('should correctly update quantity and recalculate average price', async () => {
        const EXISTING_POSITION = { id: 201, userId: TEST_USER_ID, symbol: TEST_SYMBOL, quantity: 5, averagePrice: 300.00 };
        const NEW_QUANTITY = 10;
        // Have to calculate new average price by yourself first
        // will add function later
        const NEW_AVERAGE_PRICE = 400.00;
        
        (mockPrisma.position.findFirst as jest.Mock).mockResolvedValue(EXISTING_POSITION as any);

        const EXPECTED_UPDATED_POSITION = { ...EXISTING_POSITION, quantity: 10, averagePrice: 400 };
        (mockPrisma.position.update as jest.Mock).mockResolvedValue(EXPECTED_UPDATED_POSITION as any);
        
        const updateData = { 
            symbol: TEST_SYMBOL, 
            quantity: NEW_QUANTITY, 
            averagePrice: NEW_AVERAGE_PRICE 
        };
        const result = await updatePosition(TEST_USER_ID, updateData);

        expect(mockPrisma.position.update).toHaveBeenCalledWith({
            where: { id: EXISTING_POSITION.id },
            data: {
                quantity: 10,
                averagePrice: 400.00
            },
        });
        expect(result.averagePrice).toBe(400.00);
    });

    // Test Case 3: fetchPositionsWithPnl - successfully fetches positions with P&L
    it('should calculate P&L correctly and handle price API failure', async () => {
        const DB_POSITIONS = [
            { id: 101, userId: TEST_USER_ID, symbol: 'GOOG', quantity: 10, averagePrice: 100.00 }, 
            { id: 102, userId: TEST_USER_ID, symbol: 'AMZN', quantity: 5, averagePrice: 50.00 },   
        ];
        (mockPrisma.position.findMany as jest.Mock).mockResolvedValue(DB_POSITIONS as any);

        // Mocking: Data Service
        mockFetchStockPrice.mockResolvedValueOnce({ symbol: 'GOOG', price: 120.00 }); // GOOG Success
        mockFetchStockPrice.mockRejectedValueOnce(new Error('API Error'));             // AMZN Failure

        const result = await fetchPositionsWithPnl(TEST_USER_ID);
        
        // GOOG (Success)
        // P&L: (120 - 100) * 10 = 200.00
        expect(result[0]).toBeDefined();
        expect(result[0]?.symbol).toBe('GOOG');
        expect(result[0]?.pnl).toBe(200.00); 

        // AMZN (Failure - ใช้ราคาเฉลี่ยแทน)
        // P&L: (50 - 50) * 5 = 0.00
        expect(result[1]?.symbol).toBe('AMZN');
        expect(result[1]?.currentPrice).toBe(50.00); // ต้องเท่ากับ averagePrice
        expect(result[1]?.pnl).toBe(0.00); 
    });

    // Test Case 4: deletePosition - successfully deletes a position
    it('should successfully delete a position', async () => {
        const EXISTING_POSITION = { id: 201, userId: TEST_USER_ID, symbol: TEST_SYMBOL, quantity: TEST_QUANTITY, averagePrice: TEST_AVG_PRICE };
        (mockPrisma.position.findFirst as jest.Mock).mockResolvedValue(EXISTING_POSITION as any);
        (mockPrisma.position.delete as jest.Mock).mockResolvedValue(EXISTING_POSITION as any);
        const result = await deletePosition(TEST_USER_ID, TEST_SYMBOL);

        expect(mockPrisma.position.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.position.delete).toHaveBeenCalledWith({
            where: { id: EXISTING_POSITION.id },
        });
        expect(result.message).toEqual("Position deleted successfully.");
    });

    // Test Case 5: deletePosition - throws error if position not found
    it('should throw an error if position does not exist', async () => {
        (mockPrisma.position.findFirst as jest.Mock).mockResolvedValue(null); // No existing position
        await expect(deletePosition(TEST_USER_ID, TEST_SYMBOL)).rejects.toThrow("Position does not exist.");
        expect(mockPrisma.position.findFirst).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID, symbol: TEST_SYMBOL.toUpperCase() },
        });
        expect(mockPrisma.position.delete).not.toHaveBeenCalled();
    });

    // Test Case 6: getPositions - retrieves positions for a user
    it('should retrieve positions for a user', async () => {
        const MOCK_POSITIONS = [MOCK_POSITION];
        (mockPrisma.position.findMany as jest.Mock).mockResolvedValue(MOCK_POSITIONS as any);
        const result = await getPositions(TEST_USER_ID);

        expect(mockPrisma.position.findMany).toHaveBeenCalledWith({
            where: { userId: TEST_USER_ID },
        });
        expect(result).toEqual(MOCK_POSITIONS);
    }
    );
});