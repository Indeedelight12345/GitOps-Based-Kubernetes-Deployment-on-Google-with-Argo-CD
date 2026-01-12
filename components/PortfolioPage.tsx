
import React from 'react';
import { Portfolio } from './Portfolio';
import type { Portfolio as PortfolioType, CryptoPair } from '../types';

interface PortfolioPageProps {
    portfolio: PortfolioType;
    marketData: CryptoPair[];
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ portfolio, marketData }) => {
    return (
        <div className="container mx-auto max-w-4xl">
             <Portfolio portfolio={portfolio} marketData={marketData} />
        </div>
    );
};
