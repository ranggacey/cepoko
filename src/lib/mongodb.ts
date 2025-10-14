import mongoose from 'mongoose';

// Get MONGODB_URI from environment variable
const MONGODB_URI = process.env.MONGODB_URI || '';

// Create a type-safe global cache
declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // Only check for MONGODB_URI when actually trying to connect
  // This prevents errors during build time
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable in .env file');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
