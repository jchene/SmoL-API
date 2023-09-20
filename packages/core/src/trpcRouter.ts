
import { APIGatewayEvent, CreateAWSLambdaContextOptions, awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import * as trpc from "@trpc/server";
import * as z from "zod";
import * as crud from "../../functions/src/crud";
import { createPresignedUrlWithClient, listBucketWithClient } from './s3Client';

const t = trpc.initTRPC.create();
export const router = t.router;
export const publicProcedure = t.procedure;

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
		}),
	listPlans: publicProcedure
		.query(async () => {
			const objects = await listBucketWithClient();
			return objects;
		}),
});

const createContext = ({ }: CreateAWSLambdaContextOptions<APIGatewayEvent>) => ({})
export const handler = awsLambdaRequestHandler({
	router: appRouter,
	createContext,
})

export type AppRouter = typeof appRouter;
export type Context = trpc.inferAsyncReturnType<typeof createContext>;
