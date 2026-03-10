const express = require("express");
const router = express.Router();

const requireAdmin = require("../middlewares/requireAdmin");
const requireRole = require("../middlewares/requireRole");
const c = require("../controllers/adminUsersController");

router.use(requireAdmin);
router.use(requireRole("super"));

router.get("/", c.list);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
