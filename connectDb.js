import mongoose from "mongoose";
const dbURI =
  "mongodb+srv://onlyaddy68:5mPZQwXW2cYyzw2q@vcet.c0gng.mongodb.net/vcetbackend?retryWrites=true&w=majority&appName=vcet";

export const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(dbURI);
    console.error("Failed to connect to MongoDB", err.message);
    process.exit(1);
  }
};
