// server/src/routes/s3Route.js
const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const { getPresignedPutUrl, deleteObject } = require("../controllers/s3Controller");

router.post("/presign-put", requireAdmin, getPresignedPutUrl);
router.post("/delete", requireAdmin, deleteObject);
module.exports = router;
