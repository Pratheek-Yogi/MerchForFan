const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

async function verifyProductNames() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const product = await collection.findOne();
        console.log('One product document from the database:');
        console.log(product);

    } catch (error) {
        console.error('Error verifying product names:', error);
    } finally {
        await client.close();
    }
}

verifyProductNames();
