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
const fs = require("fs");

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

// Create a instance method
studentSchema.methods.totalScholarship = function () {
  return this.scholarship.merit + this.scholarship.other;
};

studentSchema.methods.addAge = function () {
  this.age++;
  this.save();
};

// create a static method
studentSchema.statics.setOtherToZero = function () {
  return this.updateMany({}, { "scholarship.other": 0 });
};

// defined middleware
studentSchema.pre("save", async function (next) {
  fs.writeFile(
    "record.txt",
    `One data is trying to be saved [${new Date()}]\n`,
    (err) => {
      if (err) throw err;
    }
  );
});

studentSchema.post("save", async function (doc, next) {
  fs.appendFile("record.txt", `One data is saved [${new Date()}]`, (err) => {
    if (err) throw err;
  });
});

// Create a model for students
const Student = mongoose.model("Student", studentSchema);

// Set other to zero
// Student.setOtherToZero().then((data) => {
//   console.log("data = ", data);
// });

// Find objects in students
// Student.findOne({ name: "Thomas" })
//   .then((data) => {
//     // data.addAge();
//     console.log("data = ", data);
//   })
//   .catch((err) => {
//     console.log("err = ", err);
//   });
// Student.find()
//   .then((data) => {
//     console.log("data = ", data);
//   })
//   .catch((err) => {
//     console.log("err = ", err);
//   });

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
// name: "Gina",
// age: 41,
// major: "English",
// scholarship: {
//   merit: "2300",
//   other: "1300",
// },
// });

// Save newStudent to database
// newStudent
//   .save()
//   .then(() => {
//     console.log("New student saved to database successfully!!");
//   })
//   .catch((err) => {
//     console.log("Not save");
//     console.log("Error = ", err);
//   });

const app = express();

// Port number
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Body parser middleware , if you don't use this, you can't get req.body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// index route
app.get("/", (req, res) => {
  res.send("Invalid enter point!!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}!!`);
});

app.get("/students/:name", (req, res) => {
  console.log("req.query = ", req.query);
  const { name } = req.params;
  Student.find({ name: name })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.send("There is no student data!!");
      }
    })
    .catch((e) => {
      console.log("err = ", e);
    });
});

app.post("/student", (req, res) => {
  console.log("req.body = ", req.body);
  // res.send("Get post body");
  const newStudent = new Student(req.body);
  newStudent
    .save()
    .then(() => {
      Student.find().then((data) => {
        console.log("Add new student successfully!!");
        res.send(data);
      });
    })
    .catch((err) => {
      console.log("Not save");
      console.log("Error = ", err);
    });
});
