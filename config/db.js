import mongoose from "mongoose";

async function dbConnect() {
  await mongoose.connect("mongodb://127.0.0.1:27017/cdac");
}

export default dbConnect;
