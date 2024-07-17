import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected ? : number
}

const connection : ConnectionObject = {}

async function dbConnect() : Promise<void> {
    if(connection.isConnected){
        log("Already connected to database");
        return;
    }
    
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || "");

        connection.isConnected = db.connections[0].readyState;

        log("Connected to database");
    }
    
    catch(err){

        log("Database connection failed" , err );
        process.exit(1);
    }
}

export default dbConnect;