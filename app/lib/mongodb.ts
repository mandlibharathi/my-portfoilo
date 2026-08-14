
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing. Add it to .env.local"
  );
}

const mongoUri: string = MONGODB_URI;

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache =
  global.mongooseCache ?? {
    conn: null,
    promise: null,
  };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB() {
  if (cached.conn) {
    console.log("✅ MongoDB already connected");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("⏳ Connecting to MongoDB...");

    cached.promise = mongoose
      .connect(mongoUri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => {
        console.log(
          "✅ MongoDB connected successfully"
        );

        console.log(
          "📦 Database:",
          mongooseInstance.connection.name
        );

        return mongooseInstance;
      })
      .catch((error) => {
        console.error(
          "❌ MongoDB connection failed:",
          error
        );

        cached.promise = null;

        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}

