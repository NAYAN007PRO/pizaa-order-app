import React from 'react';
import { useCart } from '../../context/CartContext';

const PizzaCard = ({ product }) => {
  const { dispatch } = useCart();

  const addToCartHandler = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="product-card">
      <img src={product.image_url || 'https://via.placeholder.com/300'} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>
          {product.description?.substring(0, 50)}...
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="price">${product.price}</span>
          <button 
            className="btn btn-primary" 
            onClick={addToCartHandler}
            disabled={!product.is_available}
          >
            {product.is_available ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PizzaCard;