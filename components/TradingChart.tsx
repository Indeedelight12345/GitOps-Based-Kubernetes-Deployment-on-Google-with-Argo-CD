
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import type { CryptoPair } from '../types';

interface TradingChartProps {
    pair: CryptoPair;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 rounded-md border border-slate-600 text-sm">
        <p className="font-bold text-white">{`Price: $${payload[0].value.toFixed(2)}`}</p>
        <p className="text-gray-400">{new Date(label).toLocaleTimeString()}</p>
      </div>
    );
  }
  return null;
};


export const TradingChart: React.FC<TradingChartProps> = ({ pair }) => {
    if (!pair || !pair.priceHistory) {
        return <div className="bg-slate-800 rounded-lg p-4 h-96 flex items-center justify-center">Loading chart data...</div>;
    }

    const chartData = pair.priceHistory.map(h => ({ time: h.time, price: h.price }));
    const isPositive = pair.price > pair.priceHistory[0]?.price;
    const strokeColor = isPositive ? '#4ade80' : '#f87171';
    const gradientColor = isPositive ? 'url(#priceGradientGreen)' : 'url(#priceGradientRed)';
    

    return (
        <div className="bg-slate-800 rounded-lg p-4 h-[350px] md:h-[450px] flex flex-col">
            <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold text-white">{pair.id}</h2>
                <div className="ml-4 flex items-baseline">
                    <span className={`text-2xl font-mono font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">{pair.quote}</span>
                </div>
                <div className={`ml-4 text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? '▲' : '▼'} {pair.change24h.toFixed(2)}%
                </div>
            </div>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            <linearGradient id="priceGradientGreen" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="priceGradientRed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f87171" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis 
                            dataKey="time" 
                            tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis 
                            domain={['dataMin', 'dataMax']}
                            stroke="#64748b"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            orientation="right"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} fill={gradientColor} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
