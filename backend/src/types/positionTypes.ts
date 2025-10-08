export interface StockPrice {
    symbol: string;
    price: number;
}

export interface PositionWithPnl {
    id: number;
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    pnl: number; // profit and loss
    return: number; // percentage return
}
// stay here tmp
export interface NewsItem {
    symbol: string;
    title: string;
    text: string;
    url: string;
    publishedDate: string;
}