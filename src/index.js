//require('dotenv').config({path: './env'});


import dotenv from "dotenv";
import connectDB from "./db/index.db.js";
import{ app }from "./app.js";

import {DB_NAME} from "./constants.js";


dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);





connectDB()
.then (() => {
app.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running on port:${process.env.PORT || 8000}`);
})
})
.catch((err) => {
    console.log("MONGO db connection failed !!" , err);
})



 
























// import express from "express";
// const app = express();

// ( async () => {
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
