
import React, { useState, useEffect } from 'react';
import type { CryptoPair, Portfolio, TradeOrder } from '../types';
import { OrderType } from '../types';

interface TradePanelProps {
    pair: CryptoPair;
    portfolio: Portfolio;
    onTrade: (order: TradeOrder) => void;
}

export const TradePanel: React.FC<TradePanelProps> = ({ pair, portfolio, onTrade }) => {
    const [activeTab, setActiveTab] = useState<OrderType>(OrderType.BUY);
    const [price, setPrice] = useState(pair.price);
    const [amount, setAmount] = useState('');
    const [total, setTotal] = useState('');

    const quoteBalance = portfolio[pair.quote] || 0;
    const baseBalance = portfolio[pair.base] || 0;
    const insufficientFunds = activeTab === OrderType.BUY ? parseFloat(total) > quoteBalance : parseFloat(amount) > baseBalance;

    useEffect(() => {
        setPrice(pair.price);
        setAmount('');
        setTotal('');
    }, [pair]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = e.target.value;
        if (/^\d*\.?\d*$/.test(newAmount)) {
            setAmount(newAmount);
            if (newAmount && price > 0) {
                setTotal((parseFloat(newAmount) * price).toFixed(6));
            } else {
                setTotal('');
            }
        }
    };

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTotal = e.target.value;
        if (/^\d*\.?\d*$/.test(newTotal)) {
            setTotal(newTotal);
            if (newTotal && price > 0) {
                setAmount((parseFloat(newTotal) / price).toFixed(6));
            } else {
                setAmount('');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numAmount = parseFloat(amount);
        if(numAmount > 0 && !insufficientFunds) {
            onTrade({
                pair,
                type: activeTab,
                amount: numAmount,
                price: price
            });
            setAmount('');
            setTotal('');
        }
    };

    const renderInput = (label: string, symbol: string, value: string, handler: (e: React.ChangeEvent<HTMLInputElement>) => void) => (
        <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handler}
                    className="w-full bg-slate-700 text-gray-200 border border-slate-600 rounded-md py-2 pl-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 text-sm">{symbol}</span>
            </div>
        </div>
    );

    return (
        <div className="bg-slate-800 rounded-lg p-4">
            <div className="flex border-b border-slate-700 mb-4">
                <button
                    onClick={() => setActiveTab(OrderType.BUY)}
                    className={`px-4 py-2 text-sm font-bold ${activeTab === OrderType.BUY ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
                >
                    Buy
                </button>
                <button
                    onClick={() => setActiveTab(OrderType.SELL)}
                    className={`px-4 py-2 text-sm font-bold ${activeTab === OrderType.SELL ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}
                >
                    Sell
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                {renderInput('Price', pair.quote, price.toFixed(2), (e) => setPrice(parseFloat(e.target.value)))}
                {renderInput('Amount', pair.base, amount, handleAmountChange)}
                {renderInput('Total', pair.quote, total, handleTotalChange)}
                
                <div className="text-xs text-gray-400 mb-4">
                    Available: {activeTab === OrderType.BUY ? `${quoteBalance.toFixed(2)} ${pair.quote}` : `${baseBalance.toFixed(6)} ${pair.base}`}
                </div>

                <button
                    type="submit"
                    disabled={insufficientFunds || !parseFloat(amount)}
                    className={`w-full py-3 rounded-md font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeTab === OrderType.BUY 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                >
                    {insufficientFunds ? 'Insufficient Funds' : `${activeTab} ${pair.base}`}
                </button>
            </form>
        </div>
    );
};
