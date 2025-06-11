require("dotenv").config({path:"../.env"});
const mongoose = require('mongoose');
const dbURL = process.env.ATLASDB_URL;
const Listing = require('../models/listing.js');
const initData = require("./data.js");

async function main() {
    try {
        await mongoose.connect(dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000,
        });
        console.log("✅ Connected to MongoDB Atlas");
    } catch (err) {
        console.log("Loaded DB URL:", dbURL);
        console.error("❌ Failed to connect to MongoDB Atlas");
        console.error(err);  // <-- Print the actual error
        process.exit(1);     // Stop execution if DB connection fails
    }
}
main();

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'68496daa71c07e95289f3a01'}));
    await Listing.insertMany(initData.data);
    console.log("DB was initialised");
}

initDB();