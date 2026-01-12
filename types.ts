
export interface CryptoPair {
    id: string;
    base: string;
    quote: string;
    price: number;
    change24h: number;
    volume24h: number;
    priceHistory: { time: number; price: number }[];
}

export interface Portfolio {
    [asset: string]: number;
}

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export interface TradeOrder {
    pair: CryptoPair;
    type: OrderType;
    amount: number;
    price: number;
}
