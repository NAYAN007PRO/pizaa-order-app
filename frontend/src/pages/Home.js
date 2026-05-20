import React, { useState, useEffect } from 'react';
import api from '../services/api';
import PizzaCard from '../components/pizza/PizzaCard';
import Loader from '../components/common/Loader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch products');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Banner Style Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '3rem', 
        padding: '2rem', 
        background: 'linear-gradient(135deg, #1d3557 0%, #457b9d 100%)', 
        borderRadius: '15px',
        color: 'white',
        boxShadow: '0 10px 20px rgba(0,0,0,0.15)'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Craving for Pizza?</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Order from the best local pizzerias with fast delivery.</p>
      </div>

      <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid #e63946', paddingBottom: '10px', display: 'inline-block' }}>
        🍕 Popular Pizzas
      </h2>

      {loading ? (  
        <Loader />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <PizzaCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;