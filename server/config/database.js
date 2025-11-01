const { MongoClient } = require('mongodb');

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'UserLogin'; // Using your UserLogin cluster

class Database {
  constructor() {
    this.client = null;
    this.db = null;
  }

  async connect() {
    if (!MONGODB_URI) {
      throw new Error('FATAL ERROR: MONGODB_URI is not defined in environment variables.');
    }
    try {
      if (!this.client) {
        console.log('🔌 Attempting to connect to MongoDB...');
        this.client = new MongoClient(MONGODB_URI, {
          retryWrites: true,
          w: 'majority',
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          socketTimeoutMS: 45000,
          tls: true,
          tlsAllowInvalidCertificates: false,
          tlsAllowInvalidHostnames: false
        });
        
        await this.client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        this.db = this.client.db(DB_NAME);
        console.log(`✅ Connected to database: ${DB_NAME}`);
        
        // Test the connection
        await this.db.admin().ping();
        console.log('✅ Database ping successful');
        
        // List collections
        const collections = await this.db.listCollections().toArray();
        console.log('📋 Available collections:', collections.map(c => c.name));
      }
      return this.db;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      console.error('Error details:', error.message);
      this.client = null;
      this.db = null;
      throw error;
    }
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('Disconnected from MongoDB');
    }
  }

  getDb() {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return this.db;
  }

  getCollection(collectionName) {
    return this.getDb().collection(collectionName);
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;
