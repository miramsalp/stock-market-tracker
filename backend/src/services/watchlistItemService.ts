import { prisma } from "../utils/prisma.js";

export const getWatchlistItem = async (userId: number) => {
    const watchlist = await prisma.watchlistItem.findMany({
        where: {
            userId: userId
        }
    });
    return watchlist;
}

export const addWatchlistItem = async (userId: number, symbol: string) => {
    // stock mostly in any app will be uppercase
    const UpperSymbol = symbol.toUpperCase();
    // console.log("Adding watchlist item:", UpperSymbol);
    const existingItem = await prisma.watchlistItem.findFirst({
        where: {
            userId: userId,
            symbol: UpperSymbol
        }
    });
    if (existingItem) throw new Error("Item already in watchlist");
    const newItem = await prisma.watchlistItem.create({
        data: {
            userId: userId,
            symbol: UpperSymbol
        }
    });
    // console.log(newItem)
    return newItem;
}

export const removeWatchlistItem = async (userId: number, symbol: string) => {
    symbol = symbol.toUpperCase();
    const existingItem = await prisma.watchlistItem.findFirst({
        where: {
            userId: userId,
            symbol: symbol
        }
    });
    if (!existingItem) throw new Error("Item not found in watchlist");
    const deletedItem = await prisma.watchlistItem.delete({
        where: {
            id: existingItem.id
        }
    });
    return deletedItem;
}
