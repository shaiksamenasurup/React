import React from 'react';
import { FILTER_TYPES } from '../utils/constants';

const FilterControls = ({ 
  filter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange, 
  stats,
  onClearPurchased 
}) => {
  return (
    <div className="card mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          {Object.entries(FILTER_TYPES).map(([key, filterType]) => (
            <button
              key={filterType}
              onClick={() => onFilterChange(filterType)}
              className={`px-4 py-2 rounded-md capitalize transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType} ({
                filterType === FILTER_TYPES.ALL ? stats.total :
                filterType === FILTER_TYPES.PURCHASED ? stats.purchased : 
                stats.pending
              })
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="input-field"
          />
          {stats.purchased > 0 && (
            <button
              onClick={onClearPurchased}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Clear Purchased
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterControls;