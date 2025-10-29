const mongoose = require('mongoose');
const Product = require('../server/models/product'); // Adjust the path to your Product model
const database = require('../server/config/database'); // Adjust the path to your database connection module

const limitedEditionProducts = [
  { ProductName: 'BARCELONA-BLACK-ORANGE-2025-26-SPECIAL-EDITION', numericId: 501, Category: 'Limited Edition', Price: '₹1,299', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'BARCELONA-COLOUR-ART-SPECIAL -EDITION', numericId: 502, Category: 'Limited Edition', Price: '₹1,399', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'BARCELONA-X-MONKEY-D -LUFFY', numericId: 503, Category: 'Limited Edition', Price: '₹1,499', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'BAYERN-125TH-ANNIVERSARY', numericId: 504, Category: 'Limited Edition', Price: '₹1,199', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'BULLS-CHICAGO-X-JORDAN-23-WINDCITY', numericId: 505, Category: 'Limited Edition', Price: '₹1,599', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Dogbaa1', numericId: 506, Category: 'Limited Edition', Price: '₹999', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'DORTMUND-NEON-SPECIAL-AUTHENTIC-ORIGINALS', numericId: 507, Category: 'Limited Edition', Price: '₹1,299', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'FC-Barcelona-Blaugrana-Stripes-Special-Edition-Jersey', numericId: 508, Category: 'Limited Edition', Price: '₹1,399', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'FC-Barcelona-X-Kobe-Bryant-Special-Edition-Jersey', numericId: 509, Category: 'Limited Edition', Price: '₹1,699', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'LAKERS-COLOUR-BLOCKED', numericId: 510, Category: 'Limited Edition', Price: '₹1,499', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'LOS-ANGELES-LAKERS-24-TRIBUTE', numericId: 511, Category: 'Limited Edition', Price: '₹1,599', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'MAN-UTD-BLACK-THIRD-ICONIC-FULL-SLEEVES', numericId: 512, Category: 'Limited Edition', Price: '₹1,399', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'MAN-UTD-BLUE-LIMITED-EDITION', numericId: 513, Category: 'Limited Edition', Price: '₹1,399', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Manchester-United-X-MLB-Special-Edition-Jersey', numericId: 514, Category: 'Limited Edition', Price: '₹1,499', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Mbappe1', numericId: 515, Category: 'Limited Edition', Price: '₹1,799', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Mclaren-World-Champions-F125', numericId: 516, Category: 'Limited Edition', Price: '₹1,899', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'MU-X-LOVE-UNITES-BLACK', numericId: 517, Category: 'Limited Edition', Price: '₹1,299', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'PumaF1-Mexico-GP', numericId: 518, Category: 'Limited Edition', Price: '₹1,799', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'REAL-MADRID-WHITE-MULTI-COLOUR-LIMITED-EDITION', numericId: 519, Category: 'Limited Edition', Price: '₹1,399', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Real-Madrid-X-MLB-Special-Edition-Jersey-2025-26', numericId: 520, Category: 'Limited Edition', Price: '₹1,499', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'Suiii1', numericId: 521, Category: 'Limited Edition', Price: '₹1,999', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'VCARB-Austin-GP-F1', numericId: 522, Category: 'Limited Edition', Price: '₹1,899', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
  { ProductName: 'World_Champion_New_1', numericId: 523, Category: 'Limited Edition', Price: '₹2,499', size: ['S', 'M', 'L', 'XL'], gender: 'Unisex' },
];

const seedProducts = async () => {
  try {
    await database.connect();
    const db = database.getDb();
    const collection = db.collection('Product_Details');

    await collection.deleteMany({ Category: 'Limited Edition' });
    console.log('Previous Limited Edition products deleted.');

    await collection.insertMany(limitedEditionProducts);
    console.log('Limited Edition products have been seeded.');
  } catch (error) {
    console.error('Error seeding Limited Edition products:', error);
  } finally {
    database.disconnect();
  }
};

seedProducts();
