const mongoose = require("mongoose");

const connectDB = (url) => mongoose.connect(url).then((con) => console.log("DB connection successful!"));

module.exports = connectDB;
