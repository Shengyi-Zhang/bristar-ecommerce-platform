const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const c = require("../controllers/adminProductsController");

router.use(requireAdmin);

router.get("/", c.list);
router.post("/", c.create);
router.put("/:id", c.update);
router.delete("/:id", c.remove);

module.exports = router;
