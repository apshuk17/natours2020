const dotenv = require('dotenv');
// Set environment variables
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

const app = require('./app');

const port = process.env.NODE_ENV === 'development' ? process.env.PORT : 8000;

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
  console.log('##DB connection successful');
  // Server listening
  app.listen(port, () => console.log(`Server is listening on ${port}`));
};

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({
  name: 'The Forest Hiker',
  price: 497,
});

testTour.save();

connectDB();
