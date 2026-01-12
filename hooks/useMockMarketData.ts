
import { useState, useEffect } from 'react';
import type { CryptoPair } from '../types';

const initialPairs: CryptoPair[] = [
    { id: 'BTC/USDT', base: 'BTC', quote: 'USDT', price: 68000, change24h: 2.5, volume24h: 50000000, priceHistory: [] },
    { id: 'ETH/USDT', base: 'ETH', quote: 'USDT', price: 3500, change24h: -1.2, volume24h: 35000000, priceHistory: [] },
    { id: 'SOL/USDT', base: 'SOL', quote: 'USDT', price: 170, change24h: 5.8, volume24h: 20000000, priceHistory: [] },
    { id: 'DOGE/USDT', base: 'DOGE', quote: 'USDT', price: 0.16, change24h: 0.5, volume24h: 15000000, priceHistory: [] },
    { id: 'XRP/USDT', base: 'XRP', quote: 'USDT', price: 0.52, change24h: -3.1, volume24h: 18000000, priceHistory: [] },
];

const generateInitialHistory = (price: number): { time: number; price: number }[] => {
    const history = [];
    let currentPrice = price * (1 + (Math.random() - 0.5) * 0.1); // Start from a slightly different price
    for (let i = 0; i < 50; i++) {
        history.push({
            time: Date.now() - (50 - i) * 3000,
            price: currentPrice
        });
        currentPrice *= 1 + (Math.random() - 0.5) * 0.005;
    }
    return history;
};

initialPairs.forEach(pair => {
    pair.priceHistory = generateInitialHistory(pair.price);
});


export const useMockMarketData = (): CryptoPair[] => {
    const [marketData, setMarketData] = useState<CryptoPair[]>(initialPairs);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prevData =>
                prevData.map(pair => {
                    const changeFactor = (Math.random() - 0.49) * 0.01; // Small random change
                    const newPrice = pair.price * (1 + changeFactor);
                    const newHistory = [...pair.priceHistory.slice(1), { time: Date.now(), price: newPrice }];
                    const change24h = ((newPrice - newHistory[0].price) / newHistory[0].price) * 100;
                    
                    return {
                        ...pair,
                        price: newPrice,
                        change24h,
                        priceHistory: newHistory,
                    };
                })
            );
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return marketData;
};
