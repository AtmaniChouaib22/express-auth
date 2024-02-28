const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const crypto = require("crypto");
const routes = require("./routes");
const MongoStore = require("connect-mongo");

const PORT = 3000;
const dbString = process.env.MONGO_URI;

const app = express();

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db initialization
mongoose
  .connect(dbString)
  .then(() => {
    console.log("session MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

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

//passport authentification
require("./config/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

//server start
app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${PORT}...`);
});
