// src/App.js - Complete Shopping List App in Single File
import React, { useState, useEffect, useReducer } from 'react';
import './App.css';

// Mock Lucide icons (since lucide-react might not be installed)
const ShoppingCart = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4M7 13v8a2 2 0 002 2h6a2 2 0 002-2v-8m-8 0V9a2 2 0 012-2h4a2 2 0 012 2v4.01" />
  </svg>
);

const Plus = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const Check = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Trash2 = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const Edit3 = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const X = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Package = ({ className, ...props }) => (
  <svg className={className} {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

// Constants
const CATEGORIES = [
  'Groceries', 'Dairy', 'Meat', 'Vegetables', 'Fruits', 
  'Bakery', 'Beverages', 'Household', 'Personal Care', 'Other'
];

const ACTION_TYPES = {
  ADD_ITEM: 'ADD_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  TOGGLE_PURCHASED: 'TOGGLE_PURCHASED',
  EDIT_ITEM: 'EDIT_ITEM',
  CLEAR_PURCHASED: 'CLEAR_PURCHASED',
  LOAD_ITEMS: 'LOAD_ITEMS'
};

const FILTER_TYPES = {
  ALL: 'all',
  PENDING: 'pending',
  PURCHASED: 'purchased'
};

// Reducer for managing shopping list state
const shoppingListReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM:
      return [
        ...state,
        {
          id: Date.now() + Math.random(),
          name: action.payload.name,
          quantity: action.payload.quantity,
          category: action.payload.category,
          purchased: false,
          createdAt: new Date().toISOString()
        }
      ];
    
    case ACTION_TYPES.DELETE_ITEM:
      return state.filter(item => item.id !== action.payload);
    
    case ACTION_TYPES.TOGGLE_PURCHASED:
      return state.map(item =>
        item.id === action.payload
          ? { ...item, purchased: !item.purchased }
          : item
      );
    
    case ACTION_TYPES.EDIT_ITEM:
      return state.map(item =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.updates }
          : item
      );
    
    case ACTION_TYPES.CLEAR_PURCHASED:
      return state.filter(item => !item.purchased);
    
    case ACTION_TYPES.LOAD_ITEMS:
      return action.payload || [];
    
    default:
      return state;
  }
};

// Custom hook for form management
const useForm = (initialState) => {
  const [values, setValues] = useState(initialState);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };
  
  const reset = () => {
    setValues(initialState);
  };
  
  const setAllValues = (newValues) => {
    setValues(newValues);
  };
  
  return [values, handleChange, reset, setAllValues];
};

// Custom hook for localStorage
const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Statistics Cards Component
const StatisticsCards = ({ stats }) => (
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

// Add Item Form Component
const AddItemForm = ({ onAddItem }) => {
  const [formValues, handleInputChange, resetForm] = useForm({
    name: '',
    quantity: 1,
    category: 'Groceries'
  });

  const handleSubmit = () => {
    if (formValues.name.trim()) {
      onAddItem({
        name: formValues.name.trim(),
        quantity: parseInt(formValues.quantity) || 1,
        category: formValues.category
      });
      resetForm();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Item</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Item name"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="number"
            name="quantity"
            value={formValues.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            min="1"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>
    </div>
  );
};

// Filter Controls Component
const FilterControls = ({ 
  filter, 
  onFilterChange, 
  searchTerm, 
  onSearchChange, 
  stats,
  onClearPurchased 
}) => (
  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

// Shopping List Item Component
const ShoppingListItem = ({ item, onTogglePurchased, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, handleEditChange, resetEdit, setAllValues] = useForm({
    name: item.name,
    quantity: item.quantity,
    category: item.category
  });

  const handleSaveEdit = () => {
    if (editValues.name.trim()) {
      onEdit(item.id, editValues);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setAllValues({
      name: item.name,
      quantity: item.quantity,
      category: item.category
    });
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setAllValues({
      name: item.name,
      quantity: item.quantity,
      category: item.category
    });
    setIsEditing(true);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 transition-all duration-200 border-l-4 ${
      item.purchased ? 'border-green-400 opacity-60' : 'border-blue-400'
    }`}>
      {isEditing ? (
        <div className="space-y-3">
          <input
            type="text"
            name="name"
            value={editValues.name}
            onChange={handleEditChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Item name"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              name="quantity"
              value={editValues.quantity}
              onChange={handleEditChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Quantity"
              min="1"
            />
            <select
              name="category"
              value={editValues.category}
              onChange={handleEditChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleSaveEdit}
              className="flex-1 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <button
              onClick={() => onTogglePurchased(item.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                item.purchased
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {item.purchased && <Check className="w-4 h-4" />}
            </button>
            <div className="flex-1">
              <h3 className={`font-medium ${
                item.purchased ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {item.name}
              </h3>
              <p className="text-sm text-gray-500">
                Quantity: {item.quantity} • Category: {item.category}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleEditClick}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              disabled={item.purchased}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  // Local storage for persistence
  const [storedItems, setStoredItems] = useLocalStorage('shopping-list-items', []);
  
  // State management using useReducer
  const [items, dispatch] = useReducer(shoppingListReducer, storedItems);
  
  // Filter and search state
  const [filter, setFilter] = useState(FILTER_TYPES.ALL);
  const [searchTerm, setSearchTerm] = useState('');

  // Statistics state
  const [stats, setStats] = useState({
    total: 0,
    purchased: 0,
    pending: 0
  });

  // Persist to localStorage whenever items change
  useEffect(() => {
    setStoredItems(items);
  }, [items, setStoredItems]);

  // Calculate statistics whenever items change
  useEffect(() => {
    const total = items.length;
    const purchased = items.filter(item => item.purchased).length;
    const pending = total - purchased;
    
    setStats({ total, purchased, pending });
  }, [items]);

  // Event handlers
  const handleAddItem = (itemData) => {
    dispatch({
      type: ACTION_TYPES.ADD_ITEM,
      payload: itemData
    });
  };

  const handleDeleteItem = (id) => {
    dispatch({ 
      type: ACTION_TYPES.DELETE_ITEM, 
      payload: id 
    });
  };

  const handleTogglePurchased = (id) => {
    dispatch({ 
      type: ACTION_TYPES.TOGGLE_PURCHASED, 
      payload: id 
    });
  };

  const handleEditItem = (id, updates) => {
    dispatch({
      type: ACTION_TYPES.EDIT_ITEM,
      payload: { id, updates }
    });
  };

  const handleClearPurchased = () => {
    dispatch({ type: ACTION_TYPES.CLEAR_PURCHASED });
  };

  // Filter items based on current filter and search term
  const filteredItems = items
    .filter(item => {
      if (filter === FILTER_TYPES.PURCHASED) return item.purchased;
      if (filter === FILTER_TYPES.PENDING) return !item.purchased;
      return true;
    })
    .filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Group items by category
  const groupedItems = filteredItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 mr-3 text-blue-600" />
            Smart Shopping List
          </h1>
          <p className="text-gray-600">Organize your shopping with ease</p>
        </div>

        {/* Statistics Cards */}
        <StatisticsCards stats={stats} />

        {/* Add Item Form */}
        <AddItemForm onAddItem={handleAddItem} />

        {/* Filter and Search Controls */}
        <FilterControls
          filter={filter}
          onFilterChange={setFilter}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          stats={stats}
          onClearPurchased={handleClearPurchased}
        />

        {/* Shopping List Items */}
        <div className="space-y-6">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
              <p className="text-gray-500">
                {items.length === 0 
                  ? "Start by adding your first shopping item!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                  {category} ({categoryItems.length})
                </h3>
                <div className="space-y-3">
                  {categoryItems.map(item => (
                    <ShoppingListItem
                      key={item.id}
                      item={item}
                      onTogglePurchased={handleTogglePurchased}
                      onDelete={handleDeleteItem}
                      onEdit={handleEditItem}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;