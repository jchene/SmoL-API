import { Bucket, StackContext } from 'sst/constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';

export function Storage({ stack }: StackContext) {
	const bucket = new Bucket(stack, 'assets', {
		cdk: {
			bucket: {
				// Allow client side access to the bucket from a different domain
				cors: [
					{
						maxAge: 3000,
						allowedOrigins: ['*'],
						allowedHeaders: ['*'],
						allowedMethods: [
							s3.HttpMethods.GET,
							s3.HttpMethods.POST,
							s3.HttpMethods.PUT,
						],
					},
				],
				blockPublicAccess: new BlockPublicAccess({
					blockPublicAcls: false,
					blockPublicPolicy: false,
					ignorePublicAcls: false,
					restrictPublicBuckets: false,
				}),
				publicReadAccess: true,
				autoDeleteObjects: true,
				removalPolicy: cdk.RemovalPolicy.DESTROY,
			},
		},
	});
	return bucket;
}