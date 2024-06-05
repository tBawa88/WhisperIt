import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

//method to connect with DB
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to Database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
        connection.isConnected = db.connections[0].readyState;
        console.log("Connection to DB successfull")
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1);
    }
}

export default dbConnect;