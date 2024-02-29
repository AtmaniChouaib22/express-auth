const router = require("express").Router();
const passport = require("passport");
const { genPassword } = require("../lib/passwordUtils");
const User = require("../config/database");
const { isAuth, isAdmin } = require("./authMiddleware");

//post routess
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })
);

router.post("/register", (req, res, next) => {
  console.log(req.body.pw);
  const saltHash = genPassword(req.body.pw); //getting pw and generating hash and salt
  //extracting the hash and salt from the retuned object
  const salt = saltHash.salt;
  const hash = saltHash.hash;
  //creating new user on db
  const newUser = new User({
    username: req.body.uname,
    hash: hash,
    salt: salt,
    admin: false,
  });

  newUser.save().then((user) => {
    console.log(user);
  });
  res.redirect("/login");
});

//Get routes

router.get("/", (req, res, next) => {
  res.send('<h1>Home</h1><p>Please <a href="/register">register</a></p>');
});

router.get("/login", (req, res, next) => {
  const form =
    '<h1>Login Page</h1><form method="POST" action="/login">\
    Enter Username:<br><input type="text" name="uname">\
    <br>Enter Password:<br><input type="password" name="pw">\
    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/register", (req, res, next) => {
  const form =
    '<h1>Register Page</h1><form method="post" action="register">\
                    Enter Username:<br><input type="text" name="uname">\
                    <br>Enter Password:<br><input type="password" name="pw">\
                    <br><br><input type="submit" value="Submit"></form>';

  res.send(form);
});

router.get("/protected-route", isAuth, (req, res, next) => {
  // This is how you check if a user is authenticated and protect a route.  You could turn this into a custom middleware to make it less redundant
  res.send("you made it to the route");
});

//admin check
router.get("/admin-route", isAdmin, (req, res, next) => {
  res.send(
    '<h1>You are an admin</h1><p><a href="/logout">Logout and reload</a></p>'
  );
});

// Visiting this route logs the user out
router.get("/logout", (req, res, next) => {
  req.logout(function () {
    res.redirect("/protected-route");
  });
});

router.get("/login-success", (req, res, next) => {
  res.send(
    '<p>You successfully logged in. --> <a href="/protected-route">Go to protected route</a></p>'
  );
});

router.get("/login-failure", (req, res, next) => {
  res.send("You entered the wrong password.");
});

module.exports = router;
