import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config/apiConfig';
import './MyOrders.css';
import OrderModal from './OrderModal';
import sessionManager from '../utils/sessionManager';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrdersWithRetry = async (retryCount = 0) => {
      const token = localStorage.getItem('token');
      
      if (!token && retryCount < 5) {
        setTimeout(() => fetchOrdersWithRetry(retryCount + 1), 1000);
        return;
      }
      
      if (!token) {
        setError('Please login to view orders - session not ready after multiple attempts');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/orders`, {
          headers: {
            'x-auth-token': token
          }
        });
        
        // Check if response is HTML (invalid)
        if (typeof res.data === 'string' && res.data.includes('<!doctype html>')) {
          throw new Error('API endpoint not found');
        }
        
        const ordersData = res.data.orders || res.data.data || res.data;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        
      } catch (err) {
        setError('Failed to fetch orders: ' + (err.response?.data?.msg || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithRetry();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="my-orders-container">
      <h2>My Orders</h2>
      {Array.isArray(orders) && orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        Array.isArray(orders) && orders.map(order => (
          <div key={order.orderId} className="order-card">
            <div className="order-header">
              <span>Order ID: {order.orderId}</span>
              <span>Date: {new Date(order.date).toLocaleDateString()}</span>
            </div>
            <div className="order-body">
              <p>Status: <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
              <p>Total: ₹{order.totalAmount.toFixed(2)}</p>
              <button onClick={() => setSelectedOrder(order)}>View Details</button>
            </div>
          </div>
        ))
      )}
      {selectedOrder && <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
};

export default MyOrders;
