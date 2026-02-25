const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/User");

async function listUsers(req, res) {
  const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
  return res.json(users);
}

async function getUser(req, res) {
  const email = (req.params.email || "").toLowerCase().trim();
  const user = await User.findOne({ email }, { password: 0 });
  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  return res.json(user);
}

async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const username = String(req.body.username || "").trim();
  const email = String(req.body.email || "").toLowerCase().trim();
  const password = String(req.body.password || "");

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ error: "Email déjà utilisé" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hash });

  return res.status(201).json({ username: user.username, email: user.email });
}

async function updateUser(req, res) {
  const email = (req.params.email || "").toLowerCase().trim();
  const update = {};

  if (req.body.username) update.username = String(req.body.username).trim();
  if (req.body.password) update.password = await bcrypt.hash(String(req.body.password), 10);

  const user = await User.findOneAndUpdate({ email }, update, {
    new: true,
    projection: { password: 0 },
  });

  if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
  return res.json(user);
}

async function deleteUser(req, res) {
  const email = (req.params.email || "").toLowerCase().trim();
  const deleted = await User.findOneAndDelete({ email });
  if (!deleted) return res.status(404).json({ error: "Utilisateur introuvable" });
  return res.json({ ok: true });
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser };