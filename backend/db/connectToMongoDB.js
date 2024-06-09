import mongoose from 'mongoose'
// Establish mongodb connection

const connectToMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'whatsapp-chat-app'
        });
        console.log("Connected to MongoDB");
    } catch(error) {
        console.log("Error in connecting to MongoDB", error.message);
    }
}

export default connectToMongoDB;

