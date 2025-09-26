const mongoose = require('mongoose');
const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/alerts_db';
module.exports = async function connectDB(){
  try{
    await mongoose.connect(uri);
    console.log('MongoDB connected');
  }catch(err){
    console.error('MongoDB connection error', err);
    process.exit(1);
  }
}
