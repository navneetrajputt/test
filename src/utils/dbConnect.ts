import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define mongodb uri in env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB(modelType: "brand" | "influencer") {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }
  try {
    cached.conn = await cached.promise;

    // Verify the connection by performing a simple query on the appropriate collection.
    if (mongoose.connection.db) {
      if (modelType === "brand") {
        await mongoose.connection.db.collection("brands").findOne({});
      } else if (modelType === "influencer") {
        await mongoose.connection.db.collection("influencers").findOne({});
      }
    } else {
      throw new Error("Database connection is not established.");
    }
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
