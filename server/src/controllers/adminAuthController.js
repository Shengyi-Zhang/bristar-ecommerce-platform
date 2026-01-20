const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

function setAdminCookie(res, payload) {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // 部署 https 后改 true
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

    const admin = await Admin.findOne({ email: String(email).toLowerCase() }).lean();
    if (!admin || !admin.isActive) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    setAdminCookie(res, { adminId: admin._id.toString(), email: admin.email });

    return res.json({ ok: true, admin: { email: admin.email, name: admin.name } });
  } catch (e) {
    next(e);
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("admin_token");
  res.json({ ok: true });
};

exports.me = async (req, res) => {
  res.json({ ok: true, admin: { adminId: req.admin.adminId, email: req.admin.email } });
};
