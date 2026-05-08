const jwt = require("jsonwebtoken");

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || "dev_secret", {
    expiresIn: "7d"
  });
}

module.exports = createToken;
