import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existItem = state.cartItems.find((x) => x.id === action.payload.id);
      let updatedCart;
      if (existItem) {
        updatedCart = state.cartItems.map((x) =>
          x.id === existItem.id ? { ...existItem, qty: existItem.qty + 1 } : x
        );
      } else {
        updatedCart = [...state.cartItems, { ...action.payload, qty: 1 }];
      }
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };
    }
    case 'REMOVE_FROM_CART': {
      const updatedCart = state.cartItems.filter((x) => x.id !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };
    }
    case 'UPDATE_QTY': {
      const updatedCart = state.cartItems.map((x) =>
        x.id === action.payload.id ? { ...x, qty: action.payload.qty } : x
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      return { ...state, cartItems: updatedCart };
    }
    case 'LOAD_CART': {
      return { ...state, cartItems: action.payload };
    }
    case 'CLEAR_CART': {
        localStorage.removeItem('cartItems');
        return { ...state, cartItems: [] };
    }
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const initialState = { cartItems: [] };
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cartItems'));
    if (storedCart) {
      dispatch({ type: 'LOAD_CART', payload: storedCart });
    }
  }, []);

  return (
    <CartContext.Provider value={{ ...state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};