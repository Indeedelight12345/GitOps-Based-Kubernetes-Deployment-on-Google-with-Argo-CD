import React from 'react';
import type { Portfolio as PortfolioType, CryptoPair } from '../types';

interface PortfolioProps {
    portfolio: PortfolioType;
    marketData: CryptoPair[];
}

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
    </svg>
);


export const Portfolio: React.FC<PortfolioProps> = ({ portfolio, marketData }) => {
    // FIX: Replaced Object.entries with a typed Object.keys().map() chain.
    // In strict mode, Object.entries can infer value types as 'unknown' for objects with index signatures.
    // This approach ensures `assetEntries` is correctly typed as [string, number][], resolving downstream type errors.
    const assetEntries = Object.keys(portfolio)
        .filter((asset) => portfolio[asset] > 0.00001)
        .map((asset): [string, number] => [asset, portfolio[asset]]);

    const totalValueInUSDT = assetEntries.reduce((acc, [asset, balance]) => {
        if (asset === 'USDT') {
            return acc + balance;
        }
        const pair = marketData.find(p => p.base === asset && p.quote === 'USDT');
        if (pair) {
            return acc + balance * pair.price;
        }
        return acc;
    }, 0);

    return (
        <div className="bg-slate-800 rounded-lg p-4 h-full">
            <div className="flex items-center mb-4">
                <WalletIcon />
                <h2 className="text-lg font-bold text-white">My Portfolio</h2>
            </div>
            <div className="mb-4">
                <p className="text-gray-400 text-sm">Total Value</p>
                <p className="text-2xl font-bold text-white">${totalValueInUSDT.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Asset</span>
                    <span>Balance</span>
                </div>
                {assetEntries.map(([asset, balance]) => (
                    <div key={asset} className="flex justify-between items-center text-sm">
                        <span className="font-bold">{asset}</span>
                        <span className="font-mono">{balance.toFixed(6)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};