import {} from 'dotenv/config';
import fs from 'fs';
import S3 from 'aws-sdk/clients/s3.js';

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

export const s3UploadFile = async (file, id) => {
  const fileStream = fs.createReadStream(file.path);

  const params = {
    Bucket: bucketName,
    Body: fileStream,
    Key: `music/${id}.pdf`,
  };

  return s3.upload(params).promise();
};

export const s3DownloadFile = (id) => {
  const params = {
    Key: `music/${id}.pdf`,
    Bucket: bucketName,
  };
  return s3.getObject(params).createReadStream();
};

export const getListOfFiles = () => {
  const params = {
    Bucket: bucketName,
  };
  return s3.listObjectsV2(params).createReadStream();
};
