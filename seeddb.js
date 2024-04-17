const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'CampusCycle';

async function seedDatabase() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Seed categories collection
    await db.collection('categories').deleteMany({});
    await db.collection('categories').insertMany(require('./categories.json'));
    console.log('Seeded categories collection');

    // Seed listings collection
    await db.collection('listings').deleteMany({});
    await db.collection('listings').insertMany(require('./listings.json'));
    console.log('Seeded listings collection');

    // Seed users collection
    await db.collection('users').deleteMany({});
    await db.collection('users').insertMany(require('./users.json'));
    console.log('Seeded users collection');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();