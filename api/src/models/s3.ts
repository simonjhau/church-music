import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME as string;
const region = process.env.AWS_BUCKET_REGION as string;
const accessKeyId = process.env.AWS_ACCESS_KEY as string;
const secretAccessKey = process.env.AWS_SECRET_KEY as string;

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId: accessKeyId, secretAccessKey: secretAccessKey },
});

interface FileInterface {
  id: string;
  path: string;
}

// Upload file to S3
export const s3UploadFile = async (
  filePath: string,
  id: string,
  fileType: string
) => {
  const fileStream = fs.createReadStream(filePath);
  const input = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${fileType}/${id}.pdf`,
  };
  // return s3.upload(params).promise();
  const command = new PutObjectCommand(input);
  await s3Client.send(command);
};

// Download file from S3
export const s3DownloadFile = async (fileType: string, id: string) => {
  const input = {
    Key: `${fileType}/${id}.pdf`,
    Bucket: bucketName,
  };
  console.log(input.Key);
  const command = new GetObjectCommand(input);
  const { Body } = await s3Client.send(command);
  return Body;
};

// Get list of files
export const getListOfFiles = async () => {
  const input = {
    Bucket: bucketName,
  };
  const command = new ListObjectsV2Command(input);
  const response = await s3Client.send(command);
  return response;
};
