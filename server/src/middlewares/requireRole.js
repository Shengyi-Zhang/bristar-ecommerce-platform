module.exports = function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!allowedRoles.includes(req.admin.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    return next();
  };
};
