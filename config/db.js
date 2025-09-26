const mongoose = require("mongoose");

const connectDb = () => {
  try {
    mongoose.connect(process.env.DB_CONNECT).then(() => {
      console.log("database connection successfully");
    });
  } catch (error) {
    console.log("database connection problem");
  }
};

module.exports = connectDb;
