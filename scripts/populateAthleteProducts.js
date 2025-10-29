const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

const athleteProducts = {
  'cristiano-ronaldo': [
    { id: 101, name: 'CR7 Jersey 2025', price: '₹1,499' },
    { id: 102, name: 'CR7 Jacket 2025 Black', price: '₹2,399' },
    { id: 103, name: 'CR7 Jersey 2025 Black', price: '₹1,399' },
    { id: 104, name: 'CR7 Al Nasser Jersey', price: '₹999' },
    { id: 105, name: 'Ronaldo Real Madrid Jersey White', price: '₹1,599' },
    { id: 106, name: 'Ronaldo Real Madrid Jersey Black', price: '₹1,499' },
    { id: 107, name: 'Ronaldo Manchester United Jersey', price: '₹1,699' },
    { id: 108, name: 'Ronaldo Manchester United Jersey Kids ', price: '₹1,299' }
  ],
  'lebron-james': [
    { id: 201, name: 'LeBron Lakers Jersey', price: '₹1,299' },
    { id: 202, name: 'LeBron T Shirt', price: '₹999' },
    { id: 203, name: 'LeBron Lakers Jersey White', price: '₹1,199' },
    { id: 204, name: 'LeBron T Shirt Purple ', price: '₹999' },
    { id: 205, name: 'LeBron Training Shorts', price: '₹1,999' },
    { id: 206, name: 'LeBron King T Shirt', price: '₹1,199' },
    { id: 207, name: 'LeBron Lakers Special T Shirt', price: '₹1,399' },
    { id: 208, name: 'LeBron Lakers Cap ', price: '₹999' },
    { id: 209, name: 'LeBron Lakers Cap Special Edition', price: '₹1,299' }
  ],
  'lewis-hamilton': [
    { id: 301, name: 'Lewis Hamilton Ferrari Cap', price: '₹1,200' },
    { id: 302, name: 'Lewis Hamilton Ferrari Jacket', price: '₹2,899' },
    { id: 303, name: 'Lewis Hamilton Ferrari Maimi Cap', price: '₹1,399' },
    { id: 304, name: 'Lewis Hamilton Ferrari T Shirt', price: '₹1,599' },
    { id: 305, name: 'Lewis Hamilton Mercedes Cap', price: '₹1,399' },
    { id: 306, name: 'Lewis Hamilton LH44 Jacket', price: '₹2,999' },
    { id: 307, name: 'Lewis Hamilton LH44 T Shirt', price: '₹2,599' }
  ],
  'virat-kohli': [
    { id: 401, name: 'Kohli T Shirt', price: '₹899' },
    { id: 402, name: 'Kohli T Shirt Black', price: '₹799' },
    { id: 403, name: 'Kohli Test Cap 269', price: '₹1,199' },
    { id: 404, name: 'Virat Black Hoodie', price: '₹999' },
    { id: 405, name: 'Virat Test Cap Special Edition', price: '₹1,299' },
    { id: 406, name: 'Virat India Jersey', price: '₹1,599' },
    { id: 407, name: 'RCB Jersey 2025', price: '₹1,199' },
    { id: 408, name: 'RCB Caps 2025', price: '₹999' },
    { id: 409, name: 'Virat RCB Jersey 2025', price: '₹1,499' }
  ]
};

async function populateAthleteProducts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        const allProducts = [];
        for (const athlete in athleteProducts) {
            const products = athleteProducts[athlete].map(p => ({
                ProductName: p.name,
                Price: p.price,
                Category: 'Popular Athletes',
                Athlete: athlete.replace('-', ' '),
                numericId: p.id
            }));
            allProducts.push(...products);
        }

        const result = await collection.insertMany(allProducts);
        console.log(`${result.insertedCount} athlete products were inserted.`);

    } catch (error) {
        console.error('Error populating athlete products:', error);
    } finally {
        await client.close();
    }
}

populateAthleteProducts();
