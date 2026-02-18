import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

let _s3: S3Client | null = null;

function getRegion() {
  return process.env.AWS_REGION!;
}

function getBucketName() {
  return process.env.S3_BUCKET_NAME!;
}

function getS3Client() {
  if (_s3) return _s3;

  const config: ConstructorParameters<typeof S3Client>[0] = {
    region: getRegion(),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  };

  if (process.env.S3_ENDPOINT) {
    config.endpoint = process.env.S3_ENDPOINT;
    config.forcePathStyle = true;
  }

  _s3 = new S3Client(config);
  return _s3;
}

/**
 * Upload a file to S3
 */
export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType?: string
) {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  return getS3Client().send(command);
}

/**
 * Get a file from S3
 */
export async function getFile(key: string) {
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getS3Client().send(command);
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getS3Client().send(command);
}

/**
 * List files in a directory/prefix
 */
export async function listFiles(prefix: string) {
  const command = new ListObjectsV2Command({
    Bucket: getBucketName(),
    Prefix: prefix,
  });

  return getS3Client().send(command);
}

/**
 * Generate a presigned URL for uploading (PUT)
 */
export async function getUploadUrl(key: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

/**
 * Generate a presigned URL for downloading (GET)
 */
export async function getDownloadUrl(key: string, expiresIn = 3600) {
  const command = new GetObjectCommand({
    Bucket: getBucketName(),
    Key: key,
  });

  return getSignedUrl(getS3Client(), command, { expiresIn });
}

/**
 * Get the public URL for a file (if bucket is public or using CloudFront)
 */
export function getPublicUrl(key: string) {
  if (process.env.CLOUDFRONT_URL) {
    return `${process.env.CLOUDFRONT_URL}/${key}`;
  }
  return `https://${getBucketName()}.s3.${getRegion()}.amazonaws.com/${key}`;
}
