const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createToken = require("../utils/token");

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    token: createToken(user._id),
    user: { id: user._id, name: user.name, email: user.email }
  });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, me };
