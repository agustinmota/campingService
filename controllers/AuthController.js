const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



async function login(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return res.send("wrong credentials");

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.send("wrong credentials");

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
    return res.json({ token, userId: user.id });
  } catch (error) {
    return res.send(error);
  }
}


module.exports = { login };