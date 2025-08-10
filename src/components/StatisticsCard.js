import React from 'react';
import { Package, Check, ShoppingCart } from 'lucide-react';

const StatisticsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-500 text-white rounded-lg p-6 text-center">
        <Package className="w-8 h-8 mx-auto mb-2" />
        <p className="text-2xl font-bold">{stats.total}</p>
        <p className="text-blue-100">Total Items</p>
      </div>
      <div className="bg-green-500 text-white rounded-lg p-6 text-center">
        <Check className="w-8 h-8 mx-auto mb-2" />
        <p className="text-2xl font-bold">{stats.purchased}</p>
        <p className="text-green-100">Purchased</p>
      </div>
      <div className="bg-orange-500 text-white rounded-lg p-6 text-center">
        <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
        <p className="text-2xl font-bold">{stats.pending}</p>
        <p className="text-orange-100">Pending</p>
      </div>
    </div>
  );
};

export default StatisticsCards;