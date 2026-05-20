import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', image_url: '', category_id: 1, is_available: true });
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await api.put(`/products/${editId}`, formData);
        alert('Product updated!');
      } else {
        await api.post('/products', formData);
        alert('Product created!');
      }
      setFormData({ name: '', description: '', price: '', image_url: '', category_id: 1, is_available: true });
      setEditId(null);
      fetchProducts();
    } catch (error) {
      alert('Error saving product');
    }
  };

  const editHandler = (product) => {
    setFormData(product);
    setEditId(product.id);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  return (
    <div>
      <h3>{editId ? 'Edit Product' : 'Add New Product'}</h3>
      <form onSubmit={submitHandler} style={{ background: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <div className="form-group">
            <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
            <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="form-group">
            <input type="number" placeholder="Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
        </div>
        <div className="form-group">
            <input type="text" placeholder="Image URL" value={formData.image_url} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
        </div>
        <button type="submit" className="btn btn-primary">{editId ? 'Update' : 'Create'}</button>
        {editId && <button type="button" className="btn btn-secondary" style={{marginLeft: '10px'}} onClick={() => { setEditId(null); setFormData({ name: '', description: '', price: '', image_url: '', category_id: 1 }); }}>Cancel</button>}
      </form>

      <h3>All Products</h3>
      {loading ? <Loader /> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Price</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.is_available ? 'Available' : 'Unavailable'}</td>
                  <td>
                    <button className="btn btn-secondary btn-sm" onClick={() => editHandler(p)}>Edit</button>
                    <button className="btn btn-danger btn-sm" style={{marginLeft: '5px'}} onClick={() => deleteHandler(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;