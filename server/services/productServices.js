const database = require('../config/database');
const { ObjectId } = require('mongodb');

class ProductService {
    static async findById(productId) {
        try {
            const db = await database.connect();
            const productsCollection = db.collection('Products_Details');
            
            // Try to find by numericId first
            let product = await productsCollection.findOne({ 
                numericId: parseInt(productId) 
            });

            // If not found by numericId, try by MongoDB _id
            if (!product) {
                try {
                    product = await productsCollection.findOne({ 
                        _id: new ObjectId(productId) 
                    });
                } catch (error) {
                    // If ObjectId conversion fails, continue
                }
            }

            return product;
        } catch (error) {
            console.error('Error finding product:', error);
            throw error;
        }
    }

    static async findByCategory(category) {
        try {
            const db = await database.connect();
            const productsCollection = db.collection('Products_Details');
            
            return await productsCollection.find({ 
                Category: category 
            }).toArray();
        } catch (error) {
            console.error('Error finding products by category:', error);
            throw error;
        }
    }

    static async findByAthlete(athleteName) {
        try {
            const db = await database.connect();
            const productsCollection = db.collection('Products_Details');
            
            return await productsCollection.find({ 
                Athlete: athleteName 
            }).toArray();
        } catch (error) {
            console.error('Error finding products by athlete:', error);
            throw error;
        }
    }
}

module.exports = ProductService;