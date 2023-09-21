// Resource: https://www.youtube.com/watch?v=DQ9pZ2NKXRo&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ&index=2&ab_channel=TraversyMedia
// 全攻略: https://www.udemy.com/course/html5-css3-z/learn/lecture/24052668#questions
// 記得先安裝 local mongodb
// main server entry point file

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

// Connect to database
mongoose
  .connect(config.database)
  .then(() => {
    console.log("Connected to database ", config.database);
  })
  .catch((err) => {
    console.log("Database error : ", err);
  });

// Define a schema
const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  major: String,
  scholarship: {
    merit: Number,
    other: Number,
  },
});

// Create a model for students
const Student = mongoose.model("Student", studentSchema);

// Find objects in students
// Student.find().then((data) => {
//   console.log("data = ", data);
// });

// Update
Student.findOneAndUpdate(
  { name: "James" },
  { major: "Stock" },
  { new: true }
).then((data) => {
  console.log("data = ", data);
});

// Create an object
// const Jon = new Student({
//   name: "James",
//   age: 31,
//   major: "English",
//   scholarship: {
//     merit: 1000,
//     other: 500,
//   },
// });

// Save Jon to database
// Jon.save()
//   .then(() => {
//     console.log("Jon saved to database successfully!!");
//   })
//   .catch((err) => {
//     console.log("Error: ", err);
//   });

const app = express();

// Port number
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// index route
app.get("/", (req, res) => {
  res.send("Invalid enter point!!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}!!`);
});
