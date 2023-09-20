// main server entry point file

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect to database
mongoose.connect(config.database);

// On connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database ", config.database);
});

// On Error
mongoose.connection.on("error", (error) => {
  console.log("Database error : ", error);
});

const app = express();

const users = require("./routes/users");

// Port number
const port = 3000;

// cors middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// body-parser middleware
app.use(bodyParser());

app.use("/users", users);

// index route
app.get("/", (req, res) => {
  res.send("Invalid enter point!!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}!!`);
});
