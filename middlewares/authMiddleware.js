const {expressjwt: jwt} = require("express-jwt");
require('dotenv').config();


const authMiddleware = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"]
});

module.exports = authMiddleware;
