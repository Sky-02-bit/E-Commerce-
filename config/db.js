import mongoose from "mongoose";
const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log(`\n connected to MongoDB database ${conn.connection.host}`);
        
    }catch(error){
        console.log(`Could not connect ${error}`);
        
    }
}
export default connectDB;