import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/common/Loader';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try { const { data } = await api.get('/orders/myorders'); setOrders(data); } 
      catch (error) { console.error(error); } 
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {loading ? <Loader /> : (
        <div className="table-container">
          {orders.length === 0 ? <p>No orders found.</p> : (
            <table>
              <thead><tr><th>ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>{order.items_summary}</td>
                    <td>${order.total_amount}</td>
                    <td><span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};
export default MyOrders;