const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



async function login(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) return res.status(401).json({ message: "wrong credentials" });

    const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isValidPassword) return res.status(401).json({ message: "wrong credentials" });

    const token = jwt.sign(
      { id: user.id, userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
}


module.exports = { login };
