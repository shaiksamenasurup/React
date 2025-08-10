import React, { useState } from 'react';
import { Trash2, Edit3, Check, X } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import useForm from '../hooks/useForm';

const ShoppingListItem = ({ item, onTogglePurchased, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, handleEditChange, resetEdit, setValue, setAllValues] = useForm({
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
            className="input-field w-full"
            placeholder="Item name"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              name="quantity"
              value={editValues.quantity}
              onChange={handleEditChange}
              className="input-field flex-1"
              placeholder="Quantity"
              min="1"
            />
            <select
              name="category"
              value={editValues.category}
              onChange={handleEditChange}
              className="input-field flex-1"
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
              className="btn-primary flex-1 flex items-center justify-center"
            >
              <Check className="w-4 h-4 mr-1" />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="btn-secondary flex-1 flex items-center justify-center"
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
              aria-label={item.purchased ? 'Mark as unpurchased' : 'Mark as purchased'}
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
              aria-label="Edit item"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              aria-label="Delete item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoppingListItem;