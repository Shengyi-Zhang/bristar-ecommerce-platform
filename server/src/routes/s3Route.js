const express = require("express");
const router = express.Router();
const requireAdmin = require("../middlewares/requireAdmin");
const { getPresignedPutUrl } = require("../controllers/s3Controller");

router.post("/presign-put", requireAdmin, getPresignedPutUrl);

module.exports = router;
