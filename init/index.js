// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listings.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
// main()
// .then((res)=>{
//     console.log("connected to db");
// })
// .catch((err)=>{
//     console.log(err);
// })
// async function main(){
//     await mongoose.connect(MONGO_URL);
// }

// const initDB = async ()=>{
//     await Listing.deleteMany({});
//     initData.data =   initData.data.map((obj)=>({...obj, owner:"69ad4bc55ce2959e12657106"}))
//     await Listing.insertMany(initData.data);
//     console.log("data was initialized");
// };
// initDB();


const mongoose = require("mongoose");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => { console.log("connected to db"); })
    .catch((err) => { console.log(err); });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    const db = mongoose.connection;
    await db.collection('listings').deleteMany({});
    const data = initData.data.map((obj) => ({
        ...obj,
        owner: new mongoose.Types.ObjectId("69ad4bc55ce2959e12657106")
    }));
    await db.collection('listings').insertMany(data);
    console.log("data was initialized");
};

initDB();