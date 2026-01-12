
import React from 'react';

const ChartBarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

interface HeaderProps {
    currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPage }) => {
    const linkClasses = "text-gray-300 hover:text-white transition-colors";
    const activeLinkClasses = "text-yellow-400 font-semibold";

    return (
        <header className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <ChartBarIcon />
                        <h1 className="text-xl font-bold text-white">Crypto-Pulse</h1>
                    </div>
                    <div className="hidden md:flex items-center space-x-6 text-sm">
                        <a href="#/markets" className={`${linkClasses} ${currentPage === 'markets' ? activeLinkClasses : ''}`}>Markets</a>
                        <a href="#/trade" className={`${linkClasses} ${currentPage === 'trade' || !currentPage ? activeLinkClasses : ''}`}>Trade</a>
                        <a href="#/portfolio" className={`${linkClasses} ${currentPage === 'portfolio' ? activeLinkClasses : ''}`}>Portfolio</a>
                        <a href="#" className={linkClasses}>Settings</a>
                    </div>
                    <div className="flex items-center">
                        <button className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md text-sm transition-colors">
                            Connect Wallet
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
