const jwt = require("jsonwebtoken");

module.exports = function requireAdmin(req, res, next) {
  try {
    const token = req.cookies?.admin_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload; // { adminId, email }
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
