
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { useMockMarketData } from './hooks/useMockMarketData';
import type { Portfolio as PortfolioType, TradeOrder } from './types';
import { TradePage } from './components/TradePage';
import { MarketsPage } from './components/MarketsPage';
import { PortfolioPage } from './components/PortfolioPage';

const getPageFromHash = () => window.location.hash.replace('#/', '') || 'trade';

const App: React.FC = () => {
    const marketData = useMockMarketData();
    const [page, setPage] = useState(getPageFromHash());
    const [selectedPairId, setSelectedPairId] = useState<string>('BTC/USDT');
    const [portfolio, setPortfolio] = useState<PortfolioType>({
        'USDT': 10000,
        'BTC': 0.5,
        'ETH': 10,
        'SOL': 100,
    });
    
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        const handleHashChange = () => {
            setPage(getPageFromHash());
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const handleSelectPair = useCallback((id: string) => {
        setSelectedPairId(id);
        // Navigate to trade page when a pair is selected from another page
        if(getPageFromHash() !== 'trade') {
            window.location.hash = '#/trade';
        }
    }, []);

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleTrade = useCallback((order: TradeOrder) => {
        const { pair, type, amount, price } = order;
        const total = amount * price;

        setPortfolio(prevPortfolio => {
            const newPortfolio = { ...prevPortfolio };
            const baseBalance = newPortfolio[pair.base] || 0;
            const quoteBalance = newPortfolio[pair.quote] || 0;

            if (type === 'BUY') {
                if (quoteBalance < total) {
                    showToast('Insufficient funds.', 'error');
                    return prevPortfolio;
                }
                newPortfolio[pair.quote] = quoteBalance - total;
                newPortfolio[pair.base] = baseBalance + amount;
            } else { // SELL
                if (baseBalance < amount) {
                    showToast('Insufficient funds.', 'error');
                    return prevPortfolio;
                }
                newPortfolio[pair.base] = baseBalance - amount;
                newPortfolio[pair.quote] = quoteBalance + total;
            }
            showToast(`Successfully ${type.toLowerCase()} ${amount} ${pair.base}`, 'success');
            return newPortfolio;
        });
    }, []);
    
    const renderPage = () => {
        switch (page) {
            case 'markets':
                return (
                    <MarketsPage
                        pairs={marketData}
                        selectedPairId={selectedPairId}
                        onSelectPair={handleSelectPair}
                    />
                );
            case 'portfolio':
                return <PortfolioPage portfolio={portfolio} marketData={marketData} />;
            case 'trade':
            default:
                return (
                    <TradePage
                        marketData={marketData}
                        selectedPairId={selectedPairId}
                        onSelectPair={handleSelectPair}
                        portfolio={portfolio}
                        onTrade={handleTrade}
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
            <Header currentPage={page} />
            <main className="p-2 sm:p-4">
                {renderPage()}
            </main>
            {toast && (
                <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {toast.message}
                </div>
            )}
        </div>
    );
};

export default App;
