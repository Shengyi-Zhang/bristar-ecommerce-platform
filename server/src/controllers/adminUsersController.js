const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");

exports.list = async (req, res, next) => {
  try {
    const admins = await Admin.find({})
      .select("email name role isActive createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ admins });
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { email, password, name, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const exists = await Admin.findOne({ email: String(email).toLowerCase() });
    if (exists) {
      return res.status(409).json({ error: "Admin already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const created = await Admin.create({
      email: String(email).toLowerCase(),
      passwordHash,
      name: name || "",
      role: role === "super" ? "super" : "editor",
      isActive: true,
    });

    res.status(201).json({
      admin: {
        id: created._id,
        email: created.email,
        name: created.name,
        role: created.role,
        isActive: created.isActive,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, role, isActive, password } = req.body || {};

    const admin = await Admin.findById(id);
    if (!admin) return res.status(404).json({ error: "Not found" });

    if (typeof name === "string") admin.name = name;
    if (role === "super" || role === "editor") admin.role = role;
    if (typeof isActive === "boolean") admin.isActive = isActive;

    if (password) {
      admin.passwordHash = await bcrypt.hash(password, 10);
    }

    await admin.save();

    res.json({
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.admin.adminId === id) {
      return res.status(400).json({ error: "You cannot delete yourself" });
    }

    const deleted = await Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Not found" });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
