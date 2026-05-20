import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const changeHandler = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    const result = await register(
      formData.name, 
      formData.email, 
      formData.password, 
      formData.phone, 
      formData.address
    );
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" onChange={changeHandler} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" onChange={changeHandler} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" onChange={changeHandler} required />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input type="text" name="phone" onChange={changeHandler} required />
        </div>
        <div className="form-group">
          <label>Delivery Address</label>
          <textarea name="address" onChange={changeHandler} rows="3" required></textarea>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Register</button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;