import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { getCurrentPrices, getPriceHistory } from '../api/priceApi';
import { formatCurrency } from '../utils/formatters';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const Charts = () => {
  const [selectedMetal, setSelectedMetal] = useState('gold');
  const [timeRange, setTimeRange] = useState(7);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [selectedMetal, timeRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [priceData, historyData] = await Promise.all([
        getCurrentPrices(),
        getPriceHistory(selectedMetal, timeRange)
      ]);
      setCurrentPrice(priceData.data.prices[selectedMetal]);
      setPriceHistory(historyData.data.history);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const chartData = priceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: item.price
  }));

  const stats = {
    periodLow: Math.min(...priceHistory.map(h => h.price)),
    periodHigh: Math.max(...priceHistory.map(h => h.price)),
    average: priceHistory.reduce((sum, h) => sum + h.price, 0) / priceHistory.length,
    volatility: currentPrice?.changePercent || 0
  };

  return (
    <div className="pb-20">
      <Header title="Price Charts" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Metal Selector */}
        <div className="flex gap-2 bg-white rounded-lg p-2 shadow-sm">
          <button
            onClick={() => setSelectedMetal('gold')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              selectedMetal === 'gold' 
                ? 'bg-primary text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Gold
          </button>
          <button
            onClick={() => setSelectedMetal('silver')}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              selectedMetal === 'silver' 
                ? 'bg-gray-400 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Silver
          </button>
        </div>

        {/* Current Price Card */}
        <Card className={`border-l-4 ${selectedMetal === 'gold' ? 'border-yellow-500' : 'border-gray-400'}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm text-gray-600 mb-1 capitalize">
                {selectedMetal} (24k)
              </div>
              <div className="text-3xl font-bold text-gray-800">
                {formatCurrency(currentPrice?.pricePerGram || 0)}
              </div>
              <div className="text-xs text-gray-500">per gram</div>
            </div>
            <div className="text-right">
              <div className={`flex items-center justify-end text-lg font-semibold ${
                currentPrice?.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp size={20} />
                <span className="ml-1">
                  {formatCurrency(currentPrice?.changePercent >= 0 ? currentPrice.changePercent : -currentPrice.changePercent)}
                </span>
              </div>
              <div className="text-sm text-gray-500">
                ({currentPrice?.changePercent >= 0 ? '+' : ''}{currentPrice?.changePercent}%)
              </div>
            </div>
          </div>
        </Card>

        {/* Time Range Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {[7, 30, 90, 365].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                timeRange === days
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {days === 7 ? '7 Days' : days === 30 ? '30 Days' : days === 90 ? '1 Year' : 'All Time'}
            </button>
          ))}
        </div>

        {/* Price Chart */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4 capitalize">
            {selectedMetal} Price Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#888"
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ddd',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => formatCurrency(value)}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={selectedMetal === 'gold' ? '#D4AF37' : '#C0C0C0'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Statistics */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Period Low</div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(stats.periodLow)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Period High</div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(stats.periodHigh)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Average</div>
              <div className="text-lg font-bold text-gray-800">
                {formatCurrency(stats.average)}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Volatility</div>
              <div className="text-lg font-bold text-gray-800">
                {stats.volatility.toFixed(2)}%
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Charts;