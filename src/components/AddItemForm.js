import React from 'react';
import { Plus } from 'lucide-react';
import { CATEGORIES } from '../utils/constants';
import useForm from '../hooks/useForm';

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
    <div className="card mb-8">
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
            className="input-field"
            required
          />
          <input
            type="number"
            name="quantity"
            value={formValues.quantity}
            onChange={handleInputChange}
            placeholder="Quantity"
            min="1"
            className="input-field"
          />
          <select
            name="category"
            value={formValues.category}
            onChange={handleInputChange}
            className="input-field"
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
          className="btn-primary w-full flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>
    </div>
  );
};

export default AddItemForm;