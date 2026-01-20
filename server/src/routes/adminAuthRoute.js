const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const auth = require("../controllers/adminAuthController");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/me", requireAdmin, auth.me);

module.exports = router;
