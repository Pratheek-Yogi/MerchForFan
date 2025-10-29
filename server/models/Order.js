const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      name: String,
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid'],
    default: 'Paid'
  }
});

module.exports = mongoose.model('Order', OrderSchema);
