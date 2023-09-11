import { ApiHandler, useBody, useQueryParam } from "sst/node/api";
import * as crud from "./crud";
import * as inputErr from "./typedefs/errors";

// Creates a single user - team name
export const createUser = ApiHandler(async (_evt) => {
	const name = useQueryParam("name");
	const team = useQueryParam("team");
	if (name == undefined || team == undefined)
		return inputErr.INPUT_MISSING_TN;
	const createResult = await crud._create(name, team);
	return { statusCode: createResult.statusCode, body: createResult.body };
});

// Lists all users
export const listUsers = ApiHandler(async (_evt) => {
	const listResult = await crud._list();
	return { statusCode: listResult.statusCode, body: listResult.body };
});

// Gets an array or a single user - team [name] | id
export const getUser = ApiHandler(async (_evt) => {
	const id = useQueryParam("id");
	const team = useQueryParam("team");
	const name = useQueryParam("name");
	const group = useQueryParam("group");
	if (team == undefined && id == undefined)
		return inputErr.INPUT_MISSING_TI;
	if (team)
		return await crud._getByTeam(team, name, group === "true");
	else if (id)
		return await crud._getById(id);
});

// Updates an array or a single user - team [name] new_team | id new_team
export const updateUser = ApiHandler(async (_evt) => {
	const id = useQueryParam("id");
	const team = useQueryParam("team");
	const newTeam = useQueryParam("new_team");
	const name = useQueryParam("name");
	const group = useQueryParam("group");
	if (team == undefined && id == undefined)
		return inputErr.INPUT_MISSING_TI;
	if (newTeam == undefined)
		return inputErr.INPUT_MISSING_TN;
	if (team)
		return await crud._updateByTeam(team, newTeam, name, group === "true");
	else if (id)
		return await crud._updateById(id, newTeam);
});

// Deletes a single user - team [name] | id
export const deleteUser = ApiHandler(async (_evt) => {
	const id = useQueryParam("id");
	const team = useQueryParam("team");
	const name = useQueryParam("name");
	const group = useQueryParam("group");
	if (team == undefined && id == undefined)
		return inputErr.INPUT_MISSING_TI;
	if (team)
		return await crud._deleteByTeam(team, name, group === "true");
	else if (id)
		return await crud._deleteById(id);
});