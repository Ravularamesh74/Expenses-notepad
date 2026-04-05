import mongoose from "mongoose";

// 🔥 Connect DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // 🔥 Event listeners
    mongoose.connection.on("connected", () => {
      console.log("🟢 MongoDB connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("🟡 MongoDB disconnected");
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);

    // 🔁 Retry after delay
    setTimeout(connectDB, 5000);
  }
};

// 🔥 Graceful shutdown (important for production)
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔻 MongoDB connection closed (app terminated)");
  process.exit(0);
});

export default connectDB;