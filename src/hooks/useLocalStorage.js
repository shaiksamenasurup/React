import { ACTION_TYPES } from '../utils/constants';

const shoppingListReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.ADD_ITEM:
      return [
        ...state,
        {
          id: Date.now() + Math.random(), // More unique ID
          name: action.payload.name,
          quantity: action.payload.quantity,
          category: action.payload.category,
          purchased: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    
    case ACTION_TYPES.DELETE_ITEM:
      return state.filter(item => item.id !== action.payload);
    
    case ACTION_TYPES.TOGGLE_PURCHASED:
      return state.map(item =>
        item.id === action.payload
          ? { 
              ...item, 
              purchased: !item.purchased,
              updatedAt: new Date().toISOString()
            }
          : item
      );
    
    case ACTION_TYPES.EDIT_ITEM:
      return state.map(item =>
        item.id === action.payload.id
          ? { 
              ...item, 
              ...action.payload.updates,
              updatedAt: new Date().toISOString()
            }
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

export default shoppingListReducer;