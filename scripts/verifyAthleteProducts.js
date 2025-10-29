const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

async function verifyAthleteProducts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const athleteProducts = await collection.find({ Category: 'Popular Athletes' }).toArray();

        if (athleteProducts.length > 0) {
            console.log('Successfully found athlete products in the database:');
            console.log(athleteProducts);
        } else {
            console.log('No athlete products found in the database.');
        }

    } catch (error) {
        console.error('Error verifying athlete products:', error);
    } finally {
        await client.close();
    }
}

verifyAthleteProducts();
