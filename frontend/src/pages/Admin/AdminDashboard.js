import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import ProductManagement from './ProductManagement';
import UserManagement from './UserManagement';
import { useSocket } from '../../hooks/useSocket'; // Import the hook

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  
  // Initialize socket (pass true because this is the admin)
  const socket = useSocket(activeTab === 'orders');

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab]);

  // SOCKET LISTENER
  useEffect(() => {
    if (socket) {
      socket.on('order_received', (newOrder) => {
        console.log("New Order Received!", newOrder);
        
        // Optional: Play a notification sound
        // const audio = new Audio('/notification.mp3');
        // audio.play();

        // Add the new order to the top of the list
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
        
        alert(`New Order Received! ID: ${newOrder.id}`);
      });
    }
  }, [socket]);

  const updateStatusHandler = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // Refresh list
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin-grid">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h3>Admin Panel</h3>
        <ul>
          <li onClick={() => setActiveTab('orders')} style={{ background: activeTab === 'orders' ? '#e63946' : 'transparent', color: activeTab === 'orders' ? 'white' : 'inherit', cursor: 'pointer' }}>
            Orders Management
          </li>
          <li onClick={() => setActiveTab('products')} style={{ background: activeTab === 'products' ? '#e63946' : 'transparent', color: activeTab === 'products' ? 'white' : 'inherit', cursor: 'pointer' }}>
            Products Management
          </li>
          <li onClick={() => setActiveTab('users')} style={{ background: activeTab === 'users' ? '#e63946' : 'transparent', color: activeTab === 'users' ? 'white' : 'inherit', cursor: 'pointer' }}>
            Users
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div>
        {activeTab === 'orders' && (
          loading ? <Loader /> : (
            <div className="table-container">
              <h3>Recent Orders</h3>
              {orders.length === 0 ? <p>No orders found.</p> : (
                <table>
                  <thead>
                    <tr><th>ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Action</th></tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.user_name}</td>
                        <td>${order.total_amount}</td>
                        <td>
                          <span className={`status-badge status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <select value={order.status} onChange={(e) => updateStatusHandler(order.id, e.target.value)} style={{ padding: '5px' }}>
                            <option value="Pending">Pending</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )
        )}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'users' && <UserManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;