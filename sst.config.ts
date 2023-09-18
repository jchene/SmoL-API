import { SSTConfig } from "sst";
import { createApi, createTable } from "./stacks/backendStack";
import { FrontendStack } from "./stacks/frontendStack";
import { Storage } from "./stacks/storageStack";

export default {
	config(_input) {
		return {
			name: "first-sst-app",
			region: "eu-west-1",
		};
	},
	stacks(app) {
		if (app.stage !== 'prod') {
			app.setDefaultRemovalPolicy('destroy');
		}
		app
			.stack(Storage)
			.stack(createTable)
			.stack(createApi)
			.stack(FrontendStack);
	},
} satisfies SSTConfig;
