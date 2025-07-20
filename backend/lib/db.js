import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conne = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conne.connection.host}`);
  } catch (error) {
    console.log(" Error connecting to MongoDB", error.message);
    process.exit(1);
  }
};
