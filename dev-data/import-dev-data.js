const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../models/tour.model');
const Review = require('../models/review.model');
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

const getFile = (Model) => {
  switch (Model) {
    case 'Tour':
      return { file: 'tours.json', model: Tour };
    case 'Review':
      return { file: 'reviews.json', model: Review };
    default:
      return null;
  }
};

// Import data in tours collection
const importData = async (Model) => {
  try {
    // Reading data
    const { file, model } = getFile(Model);
    const data = JSON.parse(
      fs.readFileSync(path.join(__dirname, 'data', file), 'utf-8')
    );
    await connectDB();
    await model.create(data);
    console.log('##Data imported successfully');
    process.exit(0);
  } catch (err) {
    console.log('##Error', err);
    process.exit(1);
  }
};

// Delate data from tours collection
const deleteData = async (Model) => {
  try {
    const { model } = getFile(Model);
    await connectDB();
    await model.deleteMany();
    console.log('##Data deleted successfully');
    process.exit(0);
  } catch (err) {
    console.log('##Error', err);
    process.exit(1);
  }
};

if (process.argv[2] === '--import') {
  importData(process.argv[3]);
} else if (process.argv[2] === '--delete') {
  deleteData(process.argv[3]);
}
