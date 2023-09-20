import { StackContext, StaticSite, use } from "sst/constructs";
import { createApi } from "./createApi";
import { createBucket } from "./createBucket";

export function createStaticSite({ stack, app }: StackContext) {
	const { api } = use(createApi);
	const { bucket } = use(createBucket);

	const site = new StaticSite(stack, "ReactSite", {
		path: "packages/frontend",
		buildCommand: "yarn run build",
		buildOutput: "dist",
		environment: {
			VITE_API_URL: api.url,
			VITE_REGION: app.region,
			VITE_S3_BUCKET_NAME: bucket.bucketName,
			VITE_S3_REGION: app.region,
		},
	});

	stack.addOutputs({
		SiteUrl: site.url,
	});
	return { site };
}