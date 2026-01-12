
import React from 'react';
import { MarketList } from './MarketList';
import { TradingChart } from './TradingChart';
import { TradePanel } from './TradePanel';
import { Portfolio } from './Portfolio';
import type { CryptoPair, Portfolio as PortfolioType, TradeOrder } from '../types';

interface TradePageProps {
    marketData: CryptoPair[];
    selectedPairId: string;
    onSelectPair: (id: string) => void;
    portfolio: PortfolioType;
    onTrade: (order: TradeOrder) => void;
}

export const TradePage: React.FC<TradePageProps> = ({
    marketData,
    selectedPairId,
    onSelectPair,
    portfolio,
    onTrade,
}) => {
    const selectedPair = marketData.find(p => p.id === selectedPairId) || marketData[0];
    
    return (
        <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-3 xl:col-span-2">
                <MarketList 
                    pairs={marketData} 
                    selectedPairId={selectedPairId} 
                    onSelectPair={onSelectPair} 
                />
            </div>
            <div className="col-span-12 lg:col-span-9 xl:col-span-7 flex flex-col gap-4">
                <TradingChart pair={selectedPair} />
                <TradePanel pair={selectedPair} portfolio={portfolio} onTrade={onTrade} />
            </div>
            <div className="col-span-12 lg:col-span-12 xl:col-span-3">
                 <Portfolio portfolio={portfolio} marketData={marketData} />
            </div>
        </div>
    );
};
