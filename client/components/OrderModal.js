import React from 'react';
import './OrderModal.css';

const OrderModal = ({ order, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
        
        <h4>Items</h4>
        <ul>
          {order.items && order.items.map((item, index) => (
            <li key={index}>
              {item.name} - {item.quantity} x ₹{item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        
        <h4>Shipping Address</h4>
        <p>
          {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}
        </p>
        
        <h4>Payment Status</h4>
        <p>{order.paymentStatus}</p>
      </div>
    </div>
  );
};

export default OrderModal;