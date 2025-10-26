const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initdata=require("./data.js");

const Mongo_URL='mongodb://127.0.0.1:27017/wanderlust';
main()
.then(res  => console.log("Connected to DB"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(Mongo_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listingsWithOwner = initdata.data.map(obj => ({
    ...obj,
    owner: "68fb1d164858e1de91797c5c" 
  }));

  await Listing.insertMany(listingsWithOwner);
  console.log("Saved to db");
};


initDB();