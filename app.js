const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
const PORT = 3000;

//db initialization
const dbString = process.env.MONGO_URI;

mongoose
  .connect(dbString)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = new MongoStore({
  mongoUrl: dbString,
  collection: "sessions",
});

//session middleware init
app.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.get("/", (req, res) => {
  console.log(req.session);
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`you visited ${req.session.views}`);
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});
