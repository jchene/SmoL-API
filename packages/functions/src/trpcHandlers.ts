import * as crud from "@first-sst-app/functions/src/crud";
import * as z from "zod";
import { publicProcedure } from "@first-sst-app/core/trpcRouter";

export const listUsers = publicProcedure.query(async () => {
	let users = (await crud._list()).body;
	return users;
});

export const authorizedProcedure = publicProcedure
	.input(z.object({ townName: z.string() }))
	.use((opts) => {
		return opts.next();
	});

export const getUserByTeam = publicProcedure.input(z.string()).query(async (opts) => {
	const { input } = opts;
	const user = crud._getById(input);
	return user;
});