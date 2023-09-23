const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/database");

app.set("view engine", "ejs");

const monkeyScheme = new mongoose.Schema({
  name: {
    type: String,
    minlength: [5, "Name must be at least 3 characters!!"],
  },
});

const Monkey = mongoose.model("Monkey", monkeyScheme);

mongoose
  .connect(config.database)
  .then(() => {
    console.log("Connected to database ", config.database);
  })
  .catch((err) => {
    console.log("Database error : ", err);
  });

// error handling with asyncronous function need to use try catch otherwise it will not work
app.get("/", async (req, res, next) => {
  try {
    const newMonkey = new Monkey({
      name: "CJ",
    });
    newMonkey
      .save()
      .then((result) => {
        console.log("result = ", result);
        res.send(result);
      })
      .catch((err) => {
        // console.log("err = ", err);
        res.send(err);
      });
  } catch (error) {
    console.log("error = ", error);
    next(error);
  }
});

app.get("/*", (req, res) => {
  res.status(404).send("404 page not found");
});

// error handler
app.use((err, req, res, next) => {
  console.log("err = ", err);
  res.status(500).send("Something broke!");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});

// const studentMiddleware = (req, res, next) => {
//   console.log("This is student middleware!!!!!!!");
//   next();
// };

// const studentMiddleware2 = (req, res, next) => {
//   console.log("This is student middleware 222222 !!!!!!!");
//   next();
// };

// multiple middleware
// app.get(
//   "/student",
//   [studentMiddleware, studentMiddleware2],
//   (req, res) => {
//     res.send("Welcome to student page.");
//   }
// );
