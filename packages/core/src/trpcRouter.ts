
import { APIGatewayEvent, CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import * as trpc from "@trpc/server";
import * as z from "zod";
import * as crud from "../../functions/src/crud";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Storage } from '../../../stacks/storageStack';
import { v4 as uuidv4 } from 'uuid';
import { use } from 'sst/constructs';

const t = trpc.initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

const createPresignedUrlWithClient = async () => {
	const client = new S3Client("eu-west-1");
	const bucket = use(Storage);
	const command = new PutObjectCommand({
		Bucket: bucket.bucketName,
		Key: uuidv4()
	});
	const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
	return { url: signedUrl };
};

const appRouter = router({
	list: publicProcedure
		.query(async () => {
			let users = await crud.rawList();
			return users;
		}),
	getById: publicProcedure
		.input(z.string())
		.query(async (opts) => {
			const { input } = opts;
			const user = await crud._getById(input);
			return user;
		}),
	signedUrl: publicProcedure
		.query(async () => {
			const presignedUrl = await createPresignedUrlWithClient();
			return presignedUrl;
		})
});

const createContext = ({ }: CreateAWSLambdaContextOptions<APIGatewayEvent>) => ({})
export const handler = awsLambdaRequestHandler({
	router: appRouter,
	createContext,
})

export type AppRouter = typeof appRouter;
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
