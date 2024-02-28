const crypto = require("crypto");

/*
the genPassword will get the text password value then use the crypto 
library with mathematical functions to generate a salt and a hash 
then return it 
the validPassword functions will get the password provided when trying to
login and we pass the previous hash and salt of that user from the db 
then reexcuting the same algorithme if the new hash equals the last
hash he get logged in
*/

function genPassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const genHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return {
    salt: salt,
    hash: genHash,
  };
}

function validPassword(password, hash, salt) {
  const hashVerify = crypto
    .pbkdf2(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

module.exports = { validPassword, genPassword };
