"use server";

import {
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
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

export async function createPresignedS3Put(): Promise<{
  url: string;
  key: string;
}> {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const key = uuidv4();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
  });
  const url = await getSignedUrl(client, command, { expiresIn: 600 });
  return { url, key };
}

export async function directUpload(
  formData: FormData
): Promise<{ directUploadResponse: PutObjectCommandOutput; key: string }> {
  try {
    const file = formData.get("file") as File;
    // see https://github.com/aws/aws-sdk-js-v3/issues/4930
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const client = new S3Client({ region: process.env.AWS_REGION });
    const key = uuidv4();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });
    const directUploadResponse = await client.send(command);
    return { directUploadResponse, key };
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

export async function post(
  userName: string,
  text: string,
  fileKey?: string
): Promise<PutCommandOutput> {
  try {
    const client = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(client);
    const command = new PutCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Item: { id: uuidv4(), text, fileKey, userName },
    });
    const results = await docClient.send(command);
    return results;
  } catch (error: any) {
    throw new Error(error);
  }
}
