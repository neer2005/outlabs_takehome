"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

export async function createPresignedS3Post() {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const { url, fields } = await createPresignedPost(client, {
    Bucket: process.env.AWS_S3_BUCKET || "",
    Key: uuidv4(),
    Conditions: [
      ["content-length-range", 0, 10485760], // up to 10 MB
      ["starts-with", "$Content-Type", "image/jpeg"],
    ],
    Fields: {
      acl: "public-read",
      "Content-Type": "image/jpeg",
    },
    Expires: 600, // Seconds before the presigned post expires. 3600 by default.
  });
  return { url, fields };
}

export async function createPresignedS3Put() {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uuidv4(),
  });
  return getSignedUrl(client, command, { expiresIn: 600 });
}
