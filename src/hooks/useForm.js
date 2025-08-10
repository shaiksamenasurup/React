import { useState } from 'react';

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
  
  const setValue = (name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const setAllValues = (newValues) => {
    setValues(newValues);
  };
  
  return [values, handleChange, reset, setValue, setAllValues];
};

export default useForm;