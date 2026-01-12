
import React, { useState } from 'react';
import type { CryptoPair } from '../types';

interface MarketListProps {
    pairs: CryptoPair[];
    selectedPairId: string;
    onSelectPair: (id: string) => void;
}

export const MarketList: React.FC<MarketListProps> = ({ pairs, selectedPairId, onSelectPair }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPairs = pairs.filter(pair => 
        pair.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-slate-800 rounded-lg p-3 h-full flex flex-col">
            <h2 className="text-lg font-bold mb-3 text-white">Markets</h2>
            <div className="relative mb-3">
                <input
                    type="text"
                    placeholder="Search pair..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-700 text-gray-200 placeholder-gray-400 border border-slate-600 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
            </div>
            <div className="flex-grow overflow-y-auto pr-1">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="text-gray-400">
                            <th className="font-normal pb-2">Pair</th>
                            <th className="font-normal pb-2 text-right">Price</th>
                            <th className="font-normal pb-2 text-right">Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPairs.map(pair => {
                            const isSelected = pair.id === selectedPairId;
                            const isPositive = pair.change24h >= 0;
                            return (
                                <tr
                                    key={pair.id}
                                    onClick={() => onSelectPair(pair.id)}
                                    className={`cursor-pointer hover:bg-slate-700/50 rounded-md ${isSelected ? 'bg-slate-700' : ''}`}
                                >
                                    <td className="py-2 px-1 font-semibold">{pair.id}</td>
                                    <td className={`py-2 px-1 text-right font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>{pair.price.toFixed(2)}</td>
                                    <td className={`py-2 px-1 text-right font-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                                        {isPositive ? '+' : ''}{pair.change24h.toFixed(2)}%
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
