const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../config/database");
const { validPassword } = require("../lib/passwordUtils");

/*
when we perform a post request to login the passport localstrategy will look for the provided json data 
in this case username and password (the provided data should have the same name on the db and the form data or 
provide custom fields to the passport middleware like below) 

the provided values will be populated to the verify callback function that will query the database to verify if 
the user exists then check if the user have valid credentials by calling the validation function then return 
a done function with the user 

*/

const customFields = {
  usernameField: "uname",
  passwordField: "pw",
};

function verifyCallback(username, password, done) {
  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return done(null, false);
      }
      const isValid = validPassword(password, user.hash, user.salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch((err) => {
      return done(err);
    });
}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});
