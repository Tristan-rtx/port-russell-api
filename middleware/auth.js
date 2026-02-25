function requireAuth(req, res, next) {
  if (req.session && req.session.user) return next();

  // API -> JSON 401
  if (
    req.originalUrl.startsWith("/catways") ||
    req.originalUrl.startsWith("/catway") ||
    req.originalUrl.startsWith("/users")
  ) {
    return res.status(401).json({ error: "Non authentifié" });
  }

  // pages -> redirect
  return res.redirect("/");
}

module.exports = { requireAuth };