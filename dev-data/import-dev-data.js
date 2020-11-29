const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tour.model');
// Set environment variables
dotenv.config({ path: './config.env' });

// Create Database string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
).replace('<DBNAME>', process.env.DATABASE_NAME);

// Connect to Database
const connectDB = async () => {
  await mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

// Import data in tours collection
const importData = async () => {
  try {
    // Reading data
    const tours = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, 'data', 'tours-simple.json'),
        'utf-8'
      )
    );
    await connectDB();
    await Tour.create(tours);
    console.log('##Data imported successfully');
    process.exit(0);
  } catch (err) {
    console.log('##Error', err);
    process.exit(1);
  }
};

// Delate data from tours collection
const deleteData = async () => {
  try {
    await connectDB();
    await Tour.deleteMany();
    console.log('##Data deleted successfully');
    process.exit(0);
  } catch (err) {
    console.log('##Error', err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
