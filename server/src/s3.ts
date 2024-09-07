import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

import { accessKeyId, bucketName, region, secretAccessKey } from "./config";

const s3Client = new S3Client({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

// Upload file to S3
export const s3UploadFile = async (
  filePath: string,
  id: string,
  fileType: string,
): Promise<void> => {
  const fileStream = fs.createReadStream(filePath);
  const input = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `${fileType}/${id}.pdf`,
  };
  const command = new PutObjectCommand(input);
  await s3Client.send(command);
};

// Download file from S3
export const s3DownloadFile = async (
  fileType: string,
  id: string,
): Promise<unknown> => {
  const input = {
    Key: `${fileType}/${id}.pdf`,
    Bucket: bucketName,
  };
  const command = new GetObjectCommand(input);
  const { Body } = await s3Client.send(command);
  return Body;
};

// Download file from S3
export const s3GetSignedUrl = async (
  fileType: string,
  id: string,
  fileName: string,
): Promise<string> => {
  const encodedName = encodeURIComponent(fileName);
  const input = {
    Key: `${fileType}/${id}.pdf`,
    Bucket: bucketName,
    ResponseContentDisposition: `attachment; filename=${encodedName}.pdf`,
  };
  const command = new GetObjectCommand(input);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

// Get list of files
export const s3GetListOfFiles =
  async (): Promise<ListObjectsV2CommandOutput> => {
    const input = {
      Bucket: bucketName,
    };
    const command = new ListObjectsV2Command(input);
    return await s3Client.send(command);
  };

interface FileTypesInterface {
  music: string;
  masses: string;
}

const fileTypes: FileTypesInterface = {
  music: "music",
  masses: "masses",
};

// Delete file from S3
export const s3DeleteFile = async (
  id: string,
  fileType: keyof FileTypesInterface,
): Promise<void> => {
  const fileTypeString = fileTypes[fileType];
  const input = {
    Bucket: bucketName,
    Key: `${fileTypeString}/${id}.pdf`,
  };
  const command = new DeleteObjectCommand(input);
  await s3Client.send(command);
};
