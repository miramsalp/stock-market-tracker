import axios from "axios";
import { FMP_API_KEY, FMP_BASE_URL } from "../utils/apiConfig.js";

interface StockPrice {
    symbol: string;
    price: number;
}

interface NewsItem {
    symbol: string;
    title: string;
    text: string;
    url: string;
    publishedDate: string;
}

export const fetchStockPrice = async (symbol: string): Promise<StockPrice> => {
    const url = `${FMP_BASE_URL}/quote/${symbol.toUpperCase()}?apikey=${FMP_API_KEY}`;
    try {
        const response = await axios.get(url);
        const data = response.data[0];
        return {
            symbol: data.symbol,
            price: data.price,
        };
    } catch (error) {
        console.error("Error fetching stock price:", error);
        throw new Error("Failed to fetch stock price");
    }
}

export const fetchStockNews = async (symbol: string): Promise<NewsItem[]> => {
    const url = `${FMP_BASE_URL}/stock_news?tickers=${symbol.toUpperCase()}&limit=5&apikey=${FMP_API_KEY}`;
    try {
        const response = await axios.get(url);
        const news = response.data.map((item: any) => ({
            symbol: item.symbol,
            title: item.title,
            text: item.text,
            url: item.url,
            publishedDate: item.publishedDate,
        })) as NewsItem[];

        return news;
    } catch (error) {
        console.error("Error fetching stock news:", error);
        throw new Error("Failed to fetch stock news");
    }
}