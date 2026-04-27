const jwt = require("jsonwebtoken");

function createToken(user) {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
}

module.exports = { createToken };