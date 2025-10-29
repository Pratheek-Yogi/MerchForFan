const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://MerchFan:Pratheek2004@userlogin.rzhrkvu.mongodb.net/UserLogin?retryWrites=true&w=majority&appName=userlogin&ssl=true&authSource=admin';
const DB_NAME = 'UserLogin';
const COLLECTION_NAME = 'Product_Details';

const cricketProducts = [
  { id: 1, name: 'Gujarat Titans Jersey 2025', price: '₹2,499' },
  { id: 2, name: 'India Training Jersey', price: '₹1,999' },
  { id: 3, name: 'India T20 WC24 Jacket', price: '₹4,999' },
  { id: 4, name: 'India ODI Fan Jersey 2025', price: '₹2,199' },
  { id: 5, name: 'India Mint Cotton Cap', price: '₹899' },
  { id: 6, name: 'India Wine Cotton Cap', price: '₹899' },
  { id: 7, name: 'KKR Sports Vest', price: '₹1,299' },
  { id: 8, name: 'KKR Fan Jersey 2025', price: '₹1,899' },
  { id: 9, name: 'KKR Fan Jersey 2025 (Kids)', price: '₹1,499' },
  { id: 10, name: 'KKR Player Edition Jersey 2025', price: '₹2,999' },
  { id: 11, name: 'KKR Retro Jersey 2008 (Kids)', price: '₹1,599' },
  { id: 12, name: 'KKR Baseball Cap', price: '₹999' },
  { id: 13, name: 'Mumbai Indians Fan Jersey 2025', price: '₹1,899' },
  { id: 14, name: 'Puma x RCB Polo T-shirt', price: '₹2,299' },
  { id: 15, name: 'Puma x RCB 2023 Jersey', price: '₹2,099' },
  { id: 16, name: 'Puma x RCB Athleisure T-shirt', price: '₹1,799' },
  { id: 17, name: 'Puma x RCB Replica Jersey (Women)', price: '₹1,999' },
  { id: 18, name: 'Rajasthan Royals Fan Jersey 2025', price: '₹1,899' },
  { id: 19, name: 'Rajasthan Royals PinkPromise Jersey', price: '₹2,199' },
  { id: 20, name: 'RCB Fan T-Shirt', price: '₹1,499' },
  { id: 21, name: 'Sunrisers Hyderabad Fan Jersey 2025', price: '₹1,899' },
];

const footballProducts = [
  { id: 1, name: 'Argentina World Cup Jersey', price: '₹4,999' },
  { id: 2, name: 'Austria Men\'s Jersey', price: '₹3,499' },
  { id: 3, name: 'Belgium Men\'s Jersey', price: '₹3,499' },
  { id: 4, name: 'Blaugrana Curves Vintage', price: '₹2,999' },
  { id: 5, name: 'Blue Lions Vintage', price: '₹2,999' },
  { id: 6, name: 'Brazil Men\'s Jersey', price: '₹3,999' },
  { id: 7, name: 'Brazil Vintage Jersey', price: '₹2,999' },
  { id: 8, name: 'Cole Palmer Special Edition', price: '₹4,499' },
  { id: 9, name: 'England Men\'s Jersey', price: '₹3,499' },
  { id: 10, name: 'FC Bayern Munich Jersey', price: '₹3,799' },
  { id: 11, name: 'France Men\'s Jersey', price: '₹3,499' },
  { id: 12, name: 'Germany Men\'s Jersey', price: '₹3,499' },
  { id: 13, name: 'Italy Men\'s Jersey', price: '₹3,499' },
  { id: 14, name: 'Italy Vintage Jersey', price: '₹2,999' },
  { id: 15, name: 'Japan Special Edition Jersey', price: '₹4,299' },
  { id: 16, name: 'Liverpool FC Jersey', price: '₹3,799' },
  { id: 17, name: 'Madrid Vintage Jersey', price: '₹2,999' },
  { id: 18, name: 'Manchester City Jersey', price: '₹3,799' },
  { id: 19, name: 'Manchester United Jersey', price: '₹3,799' },
  { id: 20, name: 'Paris Saint-Germain Jersey', price: '₹3,799' },
  { id: 21, name: 'Real Madrid Blue Jersey', price: '₹3,799' },
  { id: 22, name: 'Son Heung-min Special Edition', price: '₹4,499' },
];

const basketballProducts = [
  { id: 1, name: 'Boston Celtics Cap', price: '₹1,499' },
  { id: 2, name: 'Boston Celtics Cap (Black)', price: '₹1,499' },
  { id: 3, name: 'Boston Celtics T-shirt', price: '₹2,199' },
  { id: 4, name: 'Chicago Bulls T-shirt (Blue)', price: '₹2,199' },
  { id: 5, name: 'Chicago Bulls Cap (Red)', price: '₹1,499' },
  { id: 6, name: 'Chicago Bulls T-shirt (Red)', price: '₹2,199' },
  { id: 7, name: 'Chicago Bulls T-shirt (White)', price: '₹2,199' },
  { id: 8, name: 'Golden State Warriors Jersey', price: '₹3,499' },
  { id: 9, name: 'Golden State Warriors Jacket (Black)', price: '₹4,999' },
  { id: 10, name: 'Golden State Warriors T-shirt', price: '₹2,199' },
  { id: 11, name: 'Lakers Cap (Black)', price: '₹1,499' },
  { id: 12, name: 'Lakers Jacket (Black)', price: '₹4,999' },
  { id: 13, name: 'Lakers T-shirt (White)', price: '₹2,199' },
  { id: 14, name: 'Lakers Jacket (Yellow)', price: '₹4,999' },
];

async function populateProducts() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        const database = client.db(DB_NAME);
        const collection = database.collection(COLLECTION_NAME);

        await collection.drop();
        console.log('Dropped existing Product_Details collection.');

        const allProducts = [
            ...cricketProducts.map(p => ({ ProductName: p.name, Price: p.price, Category: 'Cricket', numericId: p.id })),
            ...footballProducts.map(p => ({ ProductName: p.name, Price: p.price, Category: 'Football', numericId: p.id })),
            ...basketballProducts.map(p => ({ ProductName: p.name, Price: p.price, Category: 'Basketball', numericId: p.id }))
        ];

        const result = await collection.insertMany(allProducts);
        console.log(`${result.insertedCount} products were inserted.`);

    } catch (error) {
        console.error('Error populating products:', error);
    } finally {
        await client.close();
    }
}

populateProducts();
