import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { getCurrentPrices } from '../api/priceApi';
import { buyMetal, sellMetal, getHoldings } from '../api/tradeApi';
import { getWalletBalance, depositMoney } from '../api/walletApi';
import { formatCurrency, formatWeight } from '../utils/formatters';
import { ShoppingCart, DollarSign, Wallet, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Trade = () => {
  const [activeTab, setActiveTab] = useState('buy');
  const [prices, setPrices] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [selectedMetal, setSelectedMetal] = useState('gold');
  const [amount, setAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pricesData, holdingsData, walletData] = await Promise.all([
        getCurrentPrices(),
        getHoldings(),
        getWalletBalance()
      ]);
      setPrices(pricesData.data.prices);
      setHoldings(holdingsData.data.holdings);
      setWallet(walletData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      await buyMetal(selectedMetal, parseFloat(amount), null);
      toast.success(`Successfully bought ${selectedMetal}!`);
      setAmount('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Purchase failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleSell = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid weight');
      return;
    }

    setProcessing(true);
    try {
      await sellMetal(selectedMetal, parseFloat(amount));
      toast.success(`Successfully sold ${selectedMetal}!`);
      setAmount('');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sale failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setProcessing(true);
    try {
      await depositMoney(parseFloat(depositAmount));
      toast.success('Deposit successful!');
      setDepositAmount('');
      setShowDepositModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;

  const currentPrice = prices?.[selectedMetal]?.pricePerGram || 0;
  const selectedHolding = holdings.find(h => h.metalType === selectedMetal);
  const calculatedWeight = amount ? (parseFloat(amount) / currentPrice).toFixed(3) : 0;
  const calculatedAmount = amount ? (parseFloat(amount) * currentPrice).toFixed(2) : 0;

  return (
    <div className="pb-20">
      <Header title="Buy Metals" />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        {/* Wallet Balance */}
        <Card className="bg-gradient-to-r from-primary to-yellow-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90 mb-1">Wallet Balance</div>
              <div className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
              <div className="text-xs opacity-75 mt-1">Available for trading</div>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <ArrowUpCircle className="inline mr-1" size={18} />
              Deposit
            </button>
          </div>
        </Card>

        {/* Buy/Sell Tabs */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('buy')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'buy' ? 'bg-white text-primary shadow' : 'text-gray-600'
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setActiveTab('sell')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'sell' ? 'bg-white text-primary shadow' : 'text-gray-600'
            }`}
          >
            Sell
          </button>
        </div>

        {/* Metal Selection */}
        <Card>
          <div className="text-sm font-medium text-gray-700 mb-3">Select Metal</div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedMetal('gold')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMetal === 'gold'
                  ? 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">🪙</div>
              <div className="font-semibold text-gray-800">Gold (24k)</div>
              <div className="text-sm text-gray-600 mt-1">
                {formatCurrency(prices?.gold?.pricePerGram)}/g
              </div>
            </button>

            <button
              onClick={() => setSelectedMetal('silver')}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedMetal === 'silver'
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">⚪</div>
              <div className="font-semibold text-gray-800">Silver (999)</div>
              <div className="text-sm text-gray-600 mt-1">
                {formatCurrency(prices?.silver?.pricePerGram)}/g
              </div>
            </button>
          </div>
        </Card>

        {/* Transaction Details */}
        <Card>
          <h3 className="font-semibold text-gray-800 mb-4">Transaction Details</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeTab === 'buy' ? 'Amount (₹)' : 'Weight (grams)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={activeTab === 'buy' ? 'Enter amount in rupees' : 'Enter weight in grams'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              step="0.01"
            />
          </div>

          {amount && activeTab === 'buy' && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="text-sm text-gray-600">You will receive</div>
              <div className="text-lg font-bold text-gray-800">{calculatedWeight}g</div>
              <div className="text-xs text-gray-500 mt-1">
                at {formatCurrency(currentPrice)}/g
              </div>
            </div>
          )}

          {amount && activeTab === 'sell' && selectedHolding && (
            <div className="bg-gray-50 p-3 rounded-lg mb-4">
              <div className="text-sm text-gray-600">You will receive</div>
              <div className="text-lg font-bold text-gray-800">{formatCurrency(calculatedAmount)}</div>
              <div className="text-xs text-gray-500 mt-1">
                Available: {formatWeight(selectedHolding.weightInGrams)}
              </div>
            </div>
          )}

          {activeTab === 'buy' ? (
            <Button
              onClick={handleBuy}
              fullWidth
              disabled={processing || !amount}
              icon={ShoppingCart}
            >
              {processing ? 'Processing...' : `Buy ${selectedMetal}`}
            </Button>
          ) : (
            <Button
              onClick={handleSell}
              fullWidth
              disabled={processing || !amount || !selectedHolding}
              variant="danger"
              icon={DollarSign}
            >
              {processing ? 'Processing...' : `Sell ${selectedMetal}`}
            </Button>
          )}
        </Card>

        {/* Holdings Summary */}
        {activeTab === 'sell' && (
          <Card>
            <h3 className="font-semibold text-gray-800 mb-3">Your Holdings</h3>
            {holdings.length > 0 ? (
              <div className="space-y-2">
                {holdings.map((holding) => (
                  <div key={holding.metalType} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{holding.metalType}</div>
                      <div className="text-sm text-gray-600">{formatWeight(holding.weightInGrams)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(holding.currentValue)}</div>
                      <div className={`text-sm ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No holdings to sell
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <Card className="w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Deposit Money</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount to deposit"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowDepositModal(false)}
                variant="secondary"
                fullWidth
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeposit}
                fullWidth
                disabled={processing || !depositAmount}
                icon={Wallet}
              >
                {processing ? 'Processing...' : 'Deposit'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Trade;