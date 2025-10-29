const database = require('../config/database');
const { ObjectId } = require('mongodb');

const getOrders = async (req, res) => {
  try {
    console.log('🔄 Fetching orders for user:', req.user.id);
    
    const db = database.getDb();
    const ordersCollection = db.collection('orders');
    
    // Convert string ID to ObjectId for query
    const userId = new ObjectId(req.user.id);
    
    // Query using the exact field name from your data: "user"
    const orders = await ordersCollection.find({ 
      user: userId 
    })
    .sort({ date: -1 })
    .toArray();
    
    if (!orders || orders.length === 0) {
      return res.json([]);
    }
    
    res.json(orders);
    
  } catch (error) {
    console.error('Error in getOrders:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getOrders
};