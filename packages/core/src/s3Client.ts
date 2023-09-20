import { PutObjectCommand, ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { Bucket } from 'sst/node/bucket';

const s3Client = new S3Client({});

export const createPresignedUrlWithClient = async () => {
	const command = new PutObjectCommand({
		Bucket: Bucket.assets.bucketName,
		Key: uuidv4(),
	});
	const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
	return { url: signedUrl };
};

export const listBucketWithClient = async () => {
	const command = new ListObjectsV2Command({
		Bucket: Bucket.assets.bucketName,
	});
	const response = await s3Client.send(command);
	const objects = response.Contents;
	return objects
};