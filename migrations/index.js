require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connect = await mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

    console.log('MongoDB connected: ', connect.connection.host);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
