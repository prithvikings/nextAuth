import { connect } from "mongoose";


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}


const dbConnect = async () => {
  if(cached.conn) {
    return cached.conn;
  }

  if(!cached.promise) {
    cached.promise= connect(MONGODB_URI).then((c)=> c.connection);
  }

  
  try{
    cached.conn=await cached.promise;
    console.log("Database connected");
  }catch(err){
    throw err;
  }

  return cached.conn;
}

export default dbConnect;