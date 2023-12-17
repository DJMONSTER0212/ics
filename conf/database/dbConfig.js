import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.set('strictQuery', true);
    
    const db = mongoose.connection;
    
    db.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    
    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
      // Implement reconnection logic if necessary
    });
    
    db.once('open', () => {
      console.log('MongoDB connected');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
};

export default connectDB;
