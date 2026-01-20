const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const s3 = new S3Client({ region: process.env.AWS_REGION });

exports.getPresignedPutUrl = async (req, res, next) => {
  try {
    const { filename, contentType } = req.body || {};
    if (!filename || !contentType)
      return res.status(400).json({ error: "Missing filename/contentType" });

    const key = `products/${Date.now()}-${filename}`; // 你也可以用 slug
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    res.json({ uploadUrl, publicUrl, key });
  } catch (e) {
    next(e);
  }
};
