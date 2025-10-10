import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Loading from '../components/common/Loading';
import { getTransactionHistory, getTransactionStats } from '../api/transactionApi';
import { formatCurrency, formatDate, formatWeight } from '../utils/formatters';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown } from 'lucide-react';

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [historyData, statsData] = await Promise.all([
        getTransactionHistory(1, 50),
        getTransactionStats()
      ]);
      setTransactions(historyData.data.transactions);
      setStats(statsData.data.stats);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  const getTransactionIcon = (type) => {
    if (type.startsWith('buy')) return <ArrowDownCircle className="text-red-500" size={20} />;
    if (type.startsWith('sell')) return <ArrowUpCircle className="text-green-500" size={20} />;
    if (type === 'deposit') return <TrendingUp className="text-green-500" size={20} />;
    return <TrendingDown className="text-red-500" size={20} />;
  };

  const getTransactionColor = (type) => {
    if (type.startsWith('buy')) return 'text-red-600';
    if (type.startsWith('sell')) return 'text-green-600';
    if (type === 'deposit') return 'text-green-600';
    return 'text-red-600';
  };

  return (
    <div className="pb-20">
      <Header title="Transaction History" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-green-50 border-l-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">Total Purchases</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats?.totalPurchases || 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats?.purchaseCount || 0} transactions
            </div>
          </Card>

          <Card className="bg-blue-50 border-l-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">Total Sales</div>
            <div className="text-2xl font-bold text-gray-800">
              {formatCurrency(stats?.totalSales || 0)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stats?.salesCount || 0} transactions
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Transactions</h2>
          
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <Card key={transaction._id} className="hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <div className="font-semibold text-gray-800 capitalize">
                          {transaction.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(transaction.timestamp)}
                        </div>
                        {transaction.weightInGrams && (
                          <div className="text-xs text-gray-400 mt-1">
                            {formatWeight(transaction.weightInGrams)} @ {formatCurrency(transaction.pricePerGram)}/g
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type.startsWith('buy') || transaction.type === 'withdrawal' ? '-' : '+'}
                        {formatCurrency(transaction.totalAmount)}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8">
              <p className="text-gray-500">No transactions yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;