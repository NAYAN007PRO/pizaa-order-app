import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Cart = () => {
  const { cartItems, dispatch } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const updateQtyHandler = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { id, qty: Number(qty) } });
  const removeHandler = (id) => dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const checkoutHandler = async () => {
    if (!user) { navigate('/login'); return; }
    setLoading(true);
    try {
      await api.post('/orders', {
        items: cartItems.map(item => ({ 
          productId: item.id, 
          quantity: item.qty, 
          price: item.price 
        })),
        totalAmount: totalPrice,
        deliveryAddress: user.address || '123 Default Street'  // ← FIXED
      });
      alert('Order Placed Successfully!');
      dispatch({ type: 'CLEAR_CART' });
      navigate('/my-orders');
    } catch (error) { 
      console.error(error.response?.data);  // ← ADDED for debugging
      alert('Error placing order'); 
    } 
    finally { setLoading(false); }
  };

  return (
    <div className="cart-screen">
      <div className="cart-items">
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? <p>Your cart is empty. <Link to="/">Go back</Link></p> : 
          cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} />
              <div style={{ flex: 1 }}><h4>{item.name}</h4><p className="price">${item.price}</p></div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select value={item.qty} onChange={(e) => updateQtyHandler(item.id, e.target.value)} style={{ padding: '8px' }}>
                  {[...Array(10).keys()].map((x) => (<option key={x + 1} value={x + 1}>{x + 1}</option>))}
                </select>
                <button className="btn btn-danger btn-sm" onClick={() => removeHandler(item.id)}>Remove</button>
              </div>
            </div>
          ))
        }
      </div>
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px', height: 'fit-content' }}>
        <h3>Order Summary</h3><hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '20px' }}>
          <span>Total</span><span>${totalPrice.toFixed(2)}</span>
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={checkoutHandler} disabled={cartItems.length === 0 || loading}>
          {loading ? 'Processing...' : 'Proceed to Checkout'}
        </button>
      </div>
    </div>
  );
};
export default Cart;