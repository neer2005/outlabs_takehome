"use server";

import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import {
  DynamoDBClient,
  ScanCommand,
  ScanCommandOutput,
} from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  PutCommandOutput,
} from "@aws-sdk/lib-dynamodb";

// export async function createPresignedS3Post() {
//   const client = new S3Client({ region: process.env.AWS_REGION });
//   const { url, fields } = await createPresignedPost(client, {
//     Bucket: process.env.AWS_S3_BUCKET || "",
//     Key: uuidv4(),
//     Conditions: [
//       ["content-length-range", 0, 10485760], // up to 10 MB
//       ["starts-with", "$Content-Type", "image/jpeg"],
//     ],
//     Fields: {
//       acl: "public-read",
//       "Content-Type": "image/jpeg",
//     },
//     Expires: 600, // Seconds before the presigned post expires. 3600 by default.
//   });
//   return { url, fields };
// }

export async function createPresignedS3Put(): Promise<string> {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: uuidv4(),
  });
  return await getSignedUrl(client, command, { expiresIn: 600 });
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

export async function getPosts(): Promise<ScanCommandOutput> {
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
    });
    const results = await docClient.send(command);
    return results;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function post(userName: string, text: string, fileUrl?: string): Promise<PutCommandOutput> {
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new PutCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Item: { id: uuidv4(), text, fileUrl, userName },
    });
    const results = await docClient.send(command);
    return results;
  } catch (error: any) {
    throw new Error(error);
  }
}
