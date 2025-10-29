//require('dotenv').config({path: './env'});


import dotenv from "dotenv";

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.db.js";

dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

connectDB()





























// import express from "express";
// const app = express();

// ;( async () => {
//     try{
//          await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
//          app.on("error",(error) =>{
//             console.log("ERROR: ", error);
//             throw error
//          })

//          app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//          } )
//     } catch(eroor) {
//         console.log("Error while connecting to the database", error);   
//         throw err
//     }
// })()
