const mongoose = require('mongoose');

// Set strictQuery option to true
mongoose.set('strictQuery', true);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

module.exports = {
  connectToDatabase,
};
