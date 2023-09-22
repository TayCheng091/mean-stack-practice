// Resource: https://www.youtube.com/watch?v=DQ9pZ2NKXRo&list=PLillGF-RfqbZMNtaOXJQiDebNXjVapWPZ&index=2&ab_channel=TraversyMedia
// 全攻略: https://www.udemy.com/course/html5-css3-z/learn/lecture/24059624#questions
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
  name: {
    type: String,
    minLength: [3, "Name must be at least 3 characters!!"],
    maxLength: [20, "Name must be at most 10 characters!!"],
    required: [true, "Name is required!!"],
  },
  age: {
    type: Number,
    required: [true, "Age is required!!"],
    max: [100, "Age must be at most 100!!"],
    default: 18,
  },
  major: {
    type: String,
    enum: ["Math", "English", "Computer Science", "Stock", "undecided"],
    default: "undecided",
  },
  scholarship: {
    merit: {
      type: Number,
      max: [10000, "Merit scholarship must be at most 10000!!"],
      default: 0,
    },
    other: {
      type: Number,
      default: 0,
    },
  },
});

studentSchema.methods.totalScholarship = function () {
  return this.scholarship.merit + this.scholarship.other;
};

// Create a model for students
const Student = mongoose.model("Student", studentSchema);

// Find objects in students
Student.find({ name: "Dago" }).then(([student]) => {
  console.log("student = ", student);
  console.log("totalScholarship = ", student.totalScholarship());
});

// Delete
// Student.findOneAndDelete({ name: "James" }).then((data) => {
//   console.log("data after findOneAndDelete = ", data);
// });

// Update: https://mongoosejs.com/docs/api/model.html#Model.findOneAndUpdate()
// new: bool - true to return the modified document rather than the original. defaults to false
// runValidators: if true, runs update validators on this command. Update validators validate the update operation against the model's schema.
// Student.findOneAndUpdate(
//   { name: "James" },
//   { "scholarship.merit": 40000 },
//   { new: true, runValidators: true }
// ).then((data) => {
//   console.log("data = ", data);
// });

// Create an object
// const newStudent = new Student({
//   name: "Ishihara Satomi",
//   age: 311,
//   // major: "Japanese",
//   scholarship: {
//     merit: "30000",
//     other: "400",
//   },
// });

// Save newStudent to database
// newStudent
//   .save()
//   .then(() => {
//     console.log("New student saved to database successfully!!");
//   })
//   .catch((err) => {
//     console.log("Error = ", err);
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
