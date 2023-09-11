import { StackContext, Api, Table, use } from "sst/constructs";

export const createTable = ({ stack }: StackContext) => {
	const table = new Table(stack, "UserTable", {
		fields: {
			pk: "string",
			sk: "string",
			gsi1pk: "string",
			gsi1sk: "string",
		},
		primaryIndex: {
			partitionKey: "pk",
			sortKey: "sk"
		},
		globalIndexes: {
			gsi1: { partitionKey: "gsi1pk", sortKey: "gsi1sk" }
		}
	});
	return { table };
}

export const createApi = ({ stack }: StackContext) => {
	const { table } = use(createTable);
	const api = new Api(stack, "api", {
		defaults: {
			function: {
				bind: [table],
			},
		},
		routes: {
			"GET /": "packages/functions/src/home.main",
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
		},
	});
	stack.addOutputs({
		ApiEndpoint: api.url,
	});
	return { api };
}
