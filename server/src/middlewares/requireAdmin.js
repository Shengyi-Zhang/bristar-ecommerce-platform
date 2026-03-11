const jwt = require("jsonwebtoken");

module.exports = function requireAdmin(req, res, next) {
  try {
    console.log("AUTH origin:", req.headers.origin);
    console.log("AUTH cookie header:", req.headers.cookie);
    console.log("AUTH parsed cookies:", req.cookies);
    console.log("AUTH admin_token:", req.cookies?.admin_token);
    const token = req.cookies?.admin_token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};
