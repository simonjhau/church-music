import dotenv from 'dotenv';
dotenv.config();
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
  region,
  credentials: { accessKeyId: accessKeyId, secretAccessKey: secretAccessKey },
});

export const s3UploadFile = async (file, id: string) => {
  // const fileStream = fs.createReadStream(file.path);
  const input = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `music/${id}.pdf`,
  };
  // return s3.upload(params).promise();
  const command = new PutObjectCommand(input);
  const response = await client.send(command);
};

export const s3DownloadFile = async (id: string) => {
  const input = {
    Key: `music/${id}.pdf`,
    Bucket: bucketName,
  };
  // return s3.getObject(params).createReadStream();
  const command = new GetObjectCommand(input);
  const response = await client.send(command);
  const stream = response.Body;
};

export const getListOfFiles = () => {
  const params = {
    Bucket: bucketName,
  };
  return s3.listObjectsV2(params).createReadStream();
};
