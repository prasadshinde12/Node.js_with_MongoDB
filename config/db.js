import mongoose from "mongoose";

async function dbConnect() {
   let result = await mongoose.connect("mongodb://127.0.0.1:27017/cdac");
console.log(result);

}

export default dbConnect;