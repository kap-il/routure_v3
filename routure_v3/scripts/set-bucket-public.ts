#!/usr/bin/env npx tsx

/**
 * Sets the S3 bucket policy to allow public read access,
 * and disables the Block Public Access settings.
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import {
  S3Client,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
} from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION!;
const bucketName = process.env.S3_BUCKET_NAME!;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function main() {
  console.log(`Configuring public access for bucket: ${bucketName}\n`);

  // Step 1: Disable Block Public Access
  console.log('Step 1: Disabling Block Public Access...');
  await s3.send(new PutPublicAccessBlockCommand({
    Bucket: bucketName,
    PublicAccessBlockConfiguration: {
      BlockPublicAcls: false,
      IgnorePublicAcls: false,
      BlockPublicPolicy: false,
      RestrictPublicBuckets: false,
    },
  }));
  console.log('  Done');

  // Step 2: Set bucket policy for public read
  console.log('Step 2: Setting bucket policy for public read...');
  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Sid: 'PublicReadGetObject',
        Effect: 'Allow',
        Principal: '*',
        Action: 's3:GetObject',
        Resource: `arn:aws:s3:::${bucketName}/*`,
      },
    ],
  };

  await s3.send(new PutBucketPolicyCommand({
    Bucket: bucketName,
    Policy: JSON.stringify(policy),
  }));
  console.log('  Done');

  console.log(`\nBucket "${bucketName}" is now publicly readable.`);
  console.log(`Test URL: https://${bucketName}.s3.${region}.amazonaws.com/issues/cosmic-2026/cover.webp`);
}

main().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
