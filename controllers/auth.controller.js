const bcrypt = require("bcrypt");
const User = require("../models/User");

async function login(req, res) {
  const email = (req.body.email || "").toLowerCase().trim();
  const password = req.body.password || "";

  const user = await User.findOne({ email });
  if (!user) return res.status(401).render("home", { error: "Identifiants invalides" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).render("home", { error: "Identifiants invalides" });

  req.session.user = { id: user._id.toString(), username: user.username, email: user.email };
  return res.redirect("/dashboard");
}

function logout(req, res) {
  req.session.destroy(() => res.redirect("/"));
}

module.exports = { login, logout };