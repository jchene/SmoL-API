import { SSTConfig } from "sst";
import { createBucket } from "./stacks/createBucket";
import { createTable } from "./stacks/createTable";
import { createApi } from "./stacks/createApi";
import { createStaticSite } from "./stacks/createStaticSite";

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
			.stack(createBucket)
			.stack(createTable)
			.stack(createApi)
			.stack(createStaticSite);
	},
} satisfies SSTConfig;
