const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

const footballProducts = [
    { id: 1, name: 'Argentina World Cup Jersey' },
    { id: 2, name: 'Austria Men\'s Jersey' },
    { id: 3, name: 'Belgium Men\'s Jersey' },
    { id: 4, name: 'Blaugrana Curves Vintage' },
    { id: 5, name: 'Blue Lions Vintage' },
    { id: 6, name: 'Brazil Men\'s Jersey' },
    { id: 7, name: 'Brazil Vintage Jersey' },
    { id: 8, name: 'Cole Palmer Special Edition' },
    { id: 9, name: 'England Men\'s Jersey' },
    { id: 10, name: 'FC Bayern Munich Jersey' },
    { id: 11, name: 'France Men\'s Jersey' },
    { id: 12, name: 'Germany Men\'s Jersey' },
    { id: 13, name: 'Italy Men\'s Jersey' },
    { id: 14, name: 'Italy Vintage Jersey' },
    { id: 15, name: 'Japan Special Edition Jersey' },
    { id: 16, name: 'Liverpool FC Jersey' },
    { id: 17, name: 'Madrid Vintage Jersey' },
    { id: 18, name: 'Manchester City Jersey' },
    { id: 19, name: 'Manchester United Jersey' },
    { id: 20, name: 'Paris Saint-Germain Jersey' },
    { id: 21, name: 'Real Madrid Blue Jersey' },
    { id: 22, name: 'Son Heung-min Special Edition' },
];

async function updateFootballProducts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        for (const product of footballProducts) {
            const filter = { name: product.name };
            const update = { $set: { numericId: product.id } };
            const result = await collection.updateOne(filter, update);
            console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} for product: ${product.name}`);
        }
    } catch (error) {
        console.error('Error updating football products:', error);
    } finally {
        await client.close();
    }
}

updateFootballProducts();
