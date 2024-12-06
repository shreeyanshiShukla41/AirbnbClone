const mongoose = require("mongoose");
const initdata = require("./data.js");
const listings = require("../models/listings.js");

main()
  .then((r) => console.log(r))
  .catch((e) => console.log(e));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDb = async () => {
  await listings.deleteMany({});
  initdata.data= initdata.data.map((obj)=>({...obj,owner:'673b498907c634658489d016'}))
  await listings.insertMany(initdata.data);
  console.log("data was initialized");
};

initDb();
