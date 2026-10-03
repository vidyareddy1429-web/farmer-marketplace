const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/farmer_marketplace';
    
    // Try connecting to the specified MONGO_URI with short timeout to test availability
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning]: Could not connect to local/specified MongoDB (${error.message}).`);
    console.log(`[MongoDB Fallback]: Launching in-memory MongoDB server for seamless zero-setup execution...`);
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(memoryUri);
      console.log(`[In-Memory MongoDB Connected]: ${memoryUri}`);
      
      // Auto seed memory db if newly started
      const seedData = require('../seed');
      if (typeof seedData.runSeed === 'function') {
        await seedData.runSeed();
      }
      
      return conn;
    } catch (memError) {
      console.error(`[MongoDB Error]: Failed to start MongoMemoryServer: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
