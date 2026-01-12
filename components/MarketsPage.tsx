
import React from 'react';
import { MarketList } from './MarketList';
import type { CryptoPair } from '../types';

interface MarketsPageProps {
    pairs: CryptoPair[];
    selectedPairId: string;
    onSelectPair: (id: string) => void;
}

export const MarketsPage: React.FC<MarketsPageProps> = ({ pairs, selectedPairId, onSelectPair }) => {
    return (
        <div className="container mx-auto">
            <div className="bg-slate-800 rounded-lg p-3 h-[calc(100vh-100px)]">
                 <MarketList 
                    pairs={pairs} 
                    selectedPairId={selectedPairId} 
                    onSelectPair={onSelectPair} 
                />
            </div>
        </div>
    );
};
