const path = require('path');
const fs = require('fs').promises;
const database = require('../server/config/database');

const IMAGE_DIR = path.join(__dirname, '../client/components/images/Special_Collection');

const CATEGORY_ID_PREFIX = {
    'Cricket': 600,
    'Football': 700,
    'Basketball': 800,
    'Motorsport': 900,
};

let idCounters = {
    'Cricket': 0,
    'Football': 0,
    'Basketball': 0,
    'Motorsport': 0,
};

async function seedProducts() {
    try {
        await database.connect();
        const db = database.getDb();
        const collection = db.collection('Product_Details');

        const categories = await fs.readdir(IMAGE_DIR);

        for (const category of categories) {
            const categoryPath = path.join(IMAGE_DIR, category);
            const stats = await fs.stat(categoryPath);

            if (stats.isDirectory()) {
                const files = await fs.readdir(categoryPath);

                for (const file of files) {
                    const productName = path.parse(file).name.replace(/_/g, ' ');
                    const athleteName = productName.split(' ')[0]; 

                    const numericId = CATEGORY_ID_PREFIX[category] + idCounters[category]++;
                    
                    const hundreds = Math.floor(Math.random() * 6) + 9; // Generates a number between 9 and 14 for the hundreds place
                    const randomPrice = hundreds * 100 + 99; // Creates prices like 999, 1099, ..., 1499
                    
                    const product = {
                        ProductName: productName,
                        Price: `₹${randomPrice}`, 
                        Category: "Limited Collection",
                        Sport: category,
                        Athlete: athleteName,
                        numericId: numericId,
                    };

                    await collection.insertOne(product);
                    console.log(`Inserted: ${product.ProductName}`);
                }
            }
        }
    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        await database.disconnect();
    }
}

seedProducts();
