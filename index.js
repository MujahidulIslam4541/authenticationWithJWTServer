require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const route = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// Connect to MongoDB
connectDb();

// routes
app.use(route);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
