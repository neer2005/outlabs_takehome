"use server";

import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { writeFileSync } from "fs";
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

export async function createPresignedS3Put(): Promise<string> {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uuidv4(),
  });
  return getSignedUrl(client, command, { expiresIn: 600 });
}

export async function directUpload(
  formData: FormData
): Promise<PutObjectCommandOutput> {
  try {
    const file = formData.get("file") as File;
    // see https://github.com/aws/aws-sdk-js-v3/issues/4930
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const client = new S3Client({ region: process.env.AWS_REGION });
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: uuidv4(),
      Body: buffer,
      ContentType: file.type,
    });
    return await client.send(command);
  } catch (error: any) {
    throw new Error(error);
  }
}
