import { prisma } from "../utils/prisma.js";
import { type newPosition, type PositionWithPnl } from "../types/positionTypes.js";
import { fetchStockPrice } from "./dataService.js";

// add a new position for a user
export const addPosition = async (userId: number, position: newPosition) => {
    const existingPosition = await prisma.position.findFirst({
        where: {
            userId,
            symbol: position.symbol.toUpperCase(),
        },
    });
    if (existingPosition) {
        // can't add the same stock twice
        throw new Error('Position already exists. Use update instead.');
    }

    const newPos = await prisma.position.create({
        data: {
            userId,
            symbol: position.symbol.toUpperCase(),
            quantity: position.quantity,
            averagePrice: position.averagePrice,
        },
    });
    return newPos;
}

// get all positions for a user
export const getPositions = async (userId: number) => {
    const positions = await prisma.position.findMany({
        where: { userId },
    });
    return positions;
}
// get all positions with P&L for a user
export const fetchPositionsWithPnl = async (userId: number): Promise<PositionWithPnl[]> => {
    const positions = await prisma.position.findMany({
        where: { userId },
    });

    const positionsPromises = positions.map(async (position) => {
        let currentPrice = position.averagePrice;
        
        try {
            const stockData = await fetchStockPrice(position.symbol);
            currentPrice = stockData.price;
        } catch (error) {
            console.warn(`[P&L Error] Failed to fetch price for ${position.symbol}. Using average price.`);
        }

        const pnl = (currentPrice - position.averagePrice) * position.quantity;

        const totalCost = position.averagePrice * position.quantity;
        const returnPercentage = totalCost === 0 ? 0 : (pnl / totalCost) * 100;
        return {
            id: position.id,
            symbol: position.symbol,
            quantity: position.quantity,
            averagePrice: position.averagePrice,
            currentPrice: parseFloat(currentPrice.toFixed(2)),
            pnl: parseFloat(pnl.toFixed(2)),
            return: parseFloat(returnPercentage.toFixed(2)),
        } as PositionWithPnl;
    });

    const positionsWithPnl = await Promise.all(positionsPromises);
    return positionsWithPnl;
};

// update a position for a user
export const updatePosition = async (userId: number, position: newPosition) => {
    const existingPosition = await prisma.position.findFirst({
        where: {
            userId,
            symbol: position.symbol.toUpperCase(),
        },
    });

    if (!existingPosition) {
        throw new Error('Position does not exist. Use add instead.');
    }

    const updatedPos = await prisma.position.update({
        where: { id: existingPosition.id },
        data: {
            quantity: position.quantity,
            averagePrice: position.averagePrice,
        },
    });
    return updatedPos;
}

// delete a position for a user
export const deletePosition = async (userId: number, symbol: string) => {
    const existingPosition = await prisma.position.findFirst({
        where: {
            userId,
            symbol: symbol.toUpperCase(),
        },
    });
    if (!existingPosition) {
        throw new Error('Position does not exist.');
    }

    await prisma.position.delete({
        where: { id: existingPosition.id },
    });
    return { message: 'Position deleted successfully.' };
}
