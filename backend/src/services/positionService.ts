import { prisma } from "../utils/prisma.js";

interface newPosition {
    symbol: string;
    quantity: number;
    averagePrice: number;
}

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
