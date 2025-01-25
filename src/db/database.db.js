import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const dbInstance = await mongoose.connect(`${process.env.MONGODB_URI}`) ;
        console.log("MongoDB connected successfully");

        
    } catch (error) {
        console.log("Mongodb connection error ", error) ;
        process.exit(1);
    }
}

export default connectDB;