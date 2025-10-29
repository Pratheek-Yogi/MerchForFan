const database = require('../config/database');
const { ObjectId } = require('mongodb');

class Product {
    static collection() {
        return database.getCollection('Products_Details'); // You'll need a products collection
    }

    static async findById(productId) {
        try {
            await database.connect();
            const { ObjectId } = require('mongodb');
            
            // Try to find by MongoDB ObjectId first
            let product = await this.collection().findOne({ 
                _id: new ObjectId(productId) 
            });

            // If not found, try finding by numeric ID
            if (!product) {
                product = await this.collection().findOne({ 
                    id: parseInt(productId) 
                });
            }

            return product;
        } catch (error) {
            console.error('Error finding product:', error);
            throw error;
        }
    }

    static async findByCategory(category) {
        try {
            await database.connect();
            return await this.collection().find({ 
                category: category 
            }).toArray();
        } catch (error) {
            console.error('Error finding products by category:', error);
            throw error;
        }
    }
}

module.exports = Product;