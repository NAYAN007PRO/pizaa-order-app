import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h4>La Pino'z Pizza</h4>
          <p>Delivering happiness one slice at a time. Fresh ingredients, authentic taste.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Menu</Link>
          <Link to="/cart">Cart</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="footer-section">
          <h4>Contact Us</h4>
          <p>📍 123 Pizza Street, Food City</p>
          <p>📞 +1 234 567 890</p>
          <p>✉️ support@lapinoz.com</p>
        </div>

        <div className="footer-section">
          <h4>Opening Hours</h4>
          <p>Mon - Fri: 10am - 11pm</p>
          <p>Sat - Sun: 11am - 12am</p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} La Pino'z Pizza App. All rights reserved. Built with ❤️
      </div>
    </footer>
  );
};

export default Footer;