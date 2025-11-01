const express = require('express');
const router = express.Router();
const database = require('../config/database');
const { ObjectId } = require('mongodb');

// ========== SPECIFIC ROUTES FIRST ==========

// GET /api/products/category/:category
router.get('/category/:category', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('Fetching products for category:', req.params.category);
        
        const products = await productsCollection.find({ 
            Category: req.params.category 
        }).toArray();

        console.log(`Found ${products.length} products for category ${req.params.category}`);
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// GET /api/products/athlete/:athleteName
router.get('/athlete/:athleteName', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('Fetching products for athlete:', req.params.athleteName);
        
        const products = await productsCollection.find({ 
            Athlete: req.params.athleteName 
        }).toArray();

        console.log(`Found ${products.length} products for athlete ${req.params.athleteName}`);
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching products by athlete:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// GET /api/products/limited-collection/:sport
router.get('/limited-collection/:sport', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('Fetching limited collection products for sport:', req.params.sport);
        
        const products = await productsCollection.find({ 
            Category: "Limited Collection",
            Sport: req.params.sport
        }).toArray();

        console.log(`Found ${products.length} limited collection products for sport ${req.params.sport}`);
        
        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error fetching limited collection products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch limited collection products'
        });
    }
});

// GET /api/products/hotsale
router.get('/hotsale', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        // Define specific product IDs for hot sale
        const hotSaleProductIds = [8, 15, 101, 205, 303, 402, 511, 602, 607, 620, 701, 801, 902];
        // Replace these with your actual product numericIds that should be on hot sale
        
        const hotsaleProducts = await productsCollection.find({
            numericId: { $in: hotSaleProductIds }
        }).toArray();

        res.json({
            success: true,
            data: hotsaleProducts
        });
    } catch (error) {
        console.error('Error fetching hotsale products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch hotsale products'
        });
    }
});

// routes/products.js
// GET /api/products/caps - Dedicated caps route
router.get('/caps', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('Fetching all caps');
        
        const caps = await productsCollection.find({ 
            Category: { $regex: /^caps$/i }
        }).toArray();

        console.log(`Found ${caps.length} caps`);
        
        res.json({
            success: true,
            data: caps
        });
    } catch (error) {
        console.error('Error fetching caps:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch caps'
        });
    }
});

// GET /api/products/search/:query
router.get('/search/:query', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        const query = req.params.query;

        console.log('Searching for products with query:', query);

        const products = await productsCollection.find({
            $or: [
                { ProductName: { $regex: query, $options: 'i' } },
                { Description: { $regex: query, $options: 'i' } },
                { Category: { $regex: query, $options: 'i' } },
                { Athlete: { $regex: query, $options: 'i' } }
            ]
        }).toArray();

        console.log(`Found ${products.length} products for query "${query}"`);

        res.json({
            success: true,
            data: products
        });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search products'
        });
    }
});

// ========== DEBUG ROUTES ==========

// GET /api/products/debug/all - See all products and their fields
router.get('/debug/all', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        const allProducts = await productsCollection.find({}).limit(10).toArray();
        
        // Show what fields each product has
        const productsWithFields = allProducts.map(product => ({
            _id: product._id,
            fields: Object.keys(product),
            data: product
        }));
        
        res.json({
            success: true,
            data: productsWithFields,
            totalProducts: await productsCollection.countDocuments()
        });
    } catch (error) {
        console.error('Error fetching all products:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch products'
        });
    }
});

// GET /api/products/debug/:id - Debug specific product
router.get('/debug/:id', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        let product;

        // Try by MongoDB _id
        try {
            product = await productsCollection.findOne({ 
                _id: new ObjectId(req.params.id) 
            });
        } catch (error) {
            // If ObjectId conversion fails, try other IDs
            product = await productsCollection.findOne({ 
                numericId: parseInt(req.params.id) 
            }) || await productsCollection.findOne({ 
                id: parseInt(req.params.id) 
            });
        }
        
        if (!product) {
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }
        
        res.json({
            success: true,
            data: product,
            fields: Object.keys(product || {})
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// GET /api/products/debug/categories - List all categories
router.get('/debug/categories', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        const categories = await productsCollection.distinct('Category');
        const athletes = await productsCollection.distinct('Athlete');
        
        res.json({
            success: true,
            categories: categories || [],
            athletes: athletes ? athletes.filter(a => a) : [], // Remove null values
            totalProducts: await productsCollection.countDocuments()
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories: ' + error.message
        });
    }
});

// ========== GENERIC ROUTES LAST ==========

// GET /api/products/:id - THIS MUST BE LAST!
router.get('/:id', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('Looking for product with ID:', req.params.id);
        console.log('Category query parameter:', req.query.category);
        
        let product;

        // If category is provided, search by numericId + category (for category pages)
        if (req.query.category && req.params.id !== 'undefined') {
            product = await productsCollection.findOne({ 
                numericId: parseInt(req.params.id),
                Category: req.query.category
            });
            if (product) console.log('Found by numericId + category:', req.query.category);
        }

        // Try by numericId only (for athlete pages and backward compatibility)
        if (!product && req.params.id !== 'undefined') {
            product = await productsCollection.findOne({ 
                numericId: parseInt(req.params.id) 
            });
            if (product) console.log('Found by numericId only');
        }

        // If not found by numericId, try by MongoDB _id
        if (!product) {
            try {
                product = await productsCollection.findOne({ 
                    _id: new ObjectId(req.params.id) 
                });
                if (product) console.log('Found by _id');
            } catch (error) {
                // If ObjectId conversion fails, continue
            }
        }

        if (!product) {
            console.log('Product not found with any ID type');
            return res.status(404).json({ 
                success: false, 
                message: 'Product not found' 
            });
        }

        console.log('Product found:', product.ProductName);
        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch product'
        });
    }
});

// GET /api/products/:id/related - Get related products (SIMPLE VERSION)
router.get('/:id/related', async (req, res) => {
    try {
        const db = await database.connect();
        const productsCollection = db.collection('Product_Details');
        
        console.log('🔍 Finding related products for ID:', req.params.id);
        
        // First, get the source product
        let sourceProduct;
        const sourceId = parseInt(req.params.id);

        console.log('📊 Parsed ID:', sourceId);

        if (!isNaN(sourceId)) {
            sourceProduct = await productsCollection.findOne({ 
                numericId: sourceId 
            });
            console.log('✅ Found by numericId:', sourceProduct ? 'Yes' : 'No');
        }

        // If not found by numericId, try by MongoDB _id
        if (!sourceProduct) {
            try {
                sourceProduct = await productsCollection.findOne({ 
                    _id: new ObjectId(req.params.id) 
                });
                console.log('✅ Found by _id:', sourceProduct ? 'Yes' : 'No');
            } catch (error) {
                console.log('❌ Invalid ObjectId format');
            }
        }

        if (!sourceProduct) {
            console.log('❌ Source product not found');
            return res.status(404).json({ 
                success: false, 
                message: 'Source product not found' 
            });
        }

        console.log('🎯 Source product found:', {
            name: sourceProduct.ProductName,
            category: sourceProduct.Category,
            athlete: sourceProduct.Athlete,
            numericId: sourceProduct.numericId
        });

        // SIMPLE APPROACH: Get products from same category, excluding current product
        const relatedProducts = await productsCollection.find({
            Category: sourceProduct.Category,
            numericId: { $ne: sourceProduct.numericId }
        }).limit(4).toArray();

        console.log(`📦 Found ${relatedProducts.length} related products in same category`);

        // If we don't have enough same-category products, add some from similar categories
        if (relatedProducts.length < 4) {
            console.log('🔄 Not enough related products, fetching from similar categories...');
            
            // Define category mappings (e.g., Football -> Sports)
            const categoryGroups = {
                'Football': ['Sports', 'Athletic'],
                'Cricket': ['Sports', 'Athletic'], 
                'Basketball': ['Sports', 'Athletic'],
                'Caps': ['Accessories', 'Headwear'],
                'T-Shirts': ['Clothing', 'Apparel']
            };

            const fallbackCategories = categoryGroups[sourceProduct.Category] || ['Sports'];
            
            const additionalProducts = await productsCollection.find({
                Category: { $in: fallbackCategories },
                numericId: { $ne: sourceProduct.numericId },
                _id: { $nin: relatedProducts.map(p => p._id) } // Exclude already selected
            }).limit(4 - relatedProducts.length).toArray();

            relatedProducts.push(...additionalProducts);
            console.log(`📦 Added ${additionalProducts.length} fallback products`);
        }

        res.json({
            success: true,
            data: relatedProducts,
            sourceProduct: {
                name: sourceProduct.ProductName,
                category: sourceProduct.Category
            }
        });

    } catch (error) {
        console.error('💥 ERROR in related products route:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch related products: ' + error.message,
            error: error.toString()
        });
    }
});


module.exports = router;
