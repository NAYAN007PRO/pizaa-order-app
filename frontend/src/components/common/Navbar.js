import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">La Pino'z</Link>
      <div className="nav-links">
        <Link to="/">Menu</Link>
        {user ? (
          <>
            <Link to="/cart">
              Cart {cartItems.length > 0 && <span>({cartItems.length})</span>}
            </Link>
            {user.role === 'admin' ? (
              <Link to="/admin">Admin</Link>
            ) : (
              <Link to="/my-orders">My Orders</Link>
            )}
            <button className="btn btn-secondary" onClick={logoutHandler}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;