// scripts/populateOrders.js
const database = require('../server/config/database');
const { ObjectId } = require('mongodb');

const sampleOrders = [
  {
    // IMPORTANT: Replace with a real user ID from your 'users' collection
    user: new ObjectId("6719e45678901234567890ab"), // Example ObjectId
    orderId: 'ORD-SAMPLE-001',
    date: new Date('2025-10-20T10:00:00Z'),
    status: 'Delivered',
    items: [
      {
        name: 'Classic T-Shirt',
        quantity: 2,
        price: 25.00
      },
      {
        name: 'Baseball Cap',
        quantity: 1,
        price: 15.50
      }
    ],
    totalAmount: 65.50,
    shippingAddress: {
      street: '123 Fan St',
      city: 'Merchville',
      zipCode: '12345'
    },
    paymentStatus: 'Paid'
  },
  {
    // IMPORTANT: Replace with a real user ID from your 'users' collection
    user: new ObjectId("6719e45678901234567890ab"), // Example ObjectId
    orderId: 'ORD-SAMPLE-002',
    date: new Date('2025-10-22T14:30:00Z'),
    status: 'Shipped',
    items: [
      {
        name: 'Custom Hoodie',
        quantity: 1,
        price: 55.00
      }
    ],
    totalAmount: 55.00,
    shippingAddress: {
      street: '123 Fan St',
      city: 'Merchville',
      zipCode: '12345'
    },
    paymentStatus: 'Paid'
  }
];

async function populateOrders() {
  try {
    console.log('Connecting to database...');
    const db = await database.connect();
    const ordersCollection = db.collection('orders');

    console.log('Deleting existing sample orders...');
    await ordersCollection.deleteMany({ orderId: { $regex: /^ORD-SAMPLE-/ } });

    console.log('Inserting sample orders...');
    const result = await ordersCollection.insertMany(sampleOrders);
    console.log(`${result.insertedCount} sample orders inserted successfully.`);

  } catch (error) {
    console.error('Error populating orders:', error);
  } finally {
    await database.disconnect();
    console.log('Database connection closed.');
  }
}

populateOrders();
