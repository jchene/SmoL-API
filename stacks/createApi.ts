import { StackContext, Api, use } from "sst/constructs";
import { createBucket } from "./createBucket";
import { createTable } from "./createTable";

export const createApi = ({ stack }: StackContext) => {
	const { table } = use(createTable);
	const { bucket } = use(createBucket);

	const api = new Api(stack, "api", {
		defaults: {
			function: {
				bind: [table, bucket],
			},
		},
		routes: {
			"GET /list": "packages/functions/src/sstHandlers.listUsers",
			"POST /u": "packages/functions/src/sstHandlers.createUser",
			"GET /u": "packages/functions/src/sstHandlers.getUser",
			"PUT /u": "packages/functions/src/sstHandlers.updateUser",
			"DELETE /u": "packages/functions/src/sstHandlers.deleteUser",
			'GET /trpc/{proxy+}': {
				authorizer: 'none',
				function: {
					handler: 'packages/core/src/trpcRouter.handler',
				},
			},
			'POST /trpc/{proxy+}': {
				authorizer: 'none',
				function: {
					handler: 'packages/core/src/trpcRouter.handler',
				},
			},
			"GET /python": {
				function: {
					runtime: "python3.8",
					handler: 'packages/functions/src/python/python.lambda_handler',
				},
			},
		},
	});
	stack.addOutputs({
		ApiEndpoint: api.url,
	});
	return { api };
}
