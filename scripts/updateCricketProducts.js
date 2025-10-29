const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

const cricketProducts = [
    { id: 1, name: 'Gujarat Titans Jersey 2025' },
    { id: 2, name: 'India Training Jersey' },
    { id: 3, name: 'India T20 WC24 Jacket' },
    { id: 4, name: 'India ODI Fan Jersey 2025' },
    { id: 5, name: 'India Mint Cotton Cap' },
    { id: 6, name: 'India Wine Cotton Cap' },
    { id: 7, name: 'KKR Sports Vest' },
    { id: 8, name: 'KKR Fan Jersey 2025' },
    { id: 9, name: 'KKR Fan Jersey 2025 (Kids)' },
    { id: 10, name: 'KKR Player Edition Jersey 2025' },
    { id: 11, name: 'KKR Retro Jersey 2008 (Kids)' },
    { id: 12, name: 'KKR Baseball Cap' },
    { id: 13, name: 'Mumbai Indians Fan Jersey 2025' },
    { id: 14, name: 'Puma x RCB Polo T-shirt' },
    { id: 15, name: 'Puma x RCB 2023 Jersey' },
    { id: 16, name: 'Puma x RCB Athleisure T-shirt' },
    { id: 17, name: 'Puma x RCB Replica Jersey (Women)' },
    { id: 18, name: 'Rajasthan Royals Fan Jersey 2025' },
    { id: 19, name: 'Rajasthan Royals PinkPromise Jersey' },
    { id: 20, name: 'RCB Fan T-Shirt' },
    { id: 21, name: 'Sunrisers Hyderabad Fan Jersey 2025' },
];

async function updateCricketProducts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        for (const product of cricketProducts) {
            const filter = { ProductName: product.name };
            const update = { $set: { numericId: product.id } };
            const result = await collection.updateOne(filter, update);
            console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} for product: ${product.name}`);
        }
    } catch (error) {
        console.error('Error updating cricket products:', error);
    } finally {
        await client.close();
    }
}

updateCricketProducts();
