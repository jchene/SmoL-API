import kuuid from "kuuid";
import { userEntity } from "@first-sst-app/core/src/userEntity";
import * as crudErr from "./typedefs/errors"

// Create a single user
export async function _create(name: string, team: string) {
	try {
		const newUser = await userEntity.put({ id: kuuid.id(), name: name, team: team }).go();
		if (!newUser.data)
			return crudErr.CRUD_NO_USER;
		return { statusCode: 201, body: "User created: " + JSON.stringify(newUser.data) };
	}
	catch (e) { return { statusCode: 400, body: "User couldn't be created: " + e }; }
}

// Lists all the users
export async function _list() {
	try {
		const users = await userEntity.scan.go();
		if (!users.data)
			return crudErr.CRUD_NO_USER
		return { statusCode: 200, body: JSON.stringify(users.data) };
	}
	catch (e) { return { statusCode: 404, body: "Couldn't get any user:  " + e }; }
}

export async function rawList(){
	try {
		const users = await userEntity.scan.go();
		return users;
	}
	catch { return undefined; };
}

// Gets a single or an array of users by team [name]
export async function _getByTeam(team: string, name?: string, groupGet?: boolean) {
	try {
		const users = await userEntity.query.byTeamAndName({ team, name }).go();
		if (!users.data || !users.data.length)
			return crudErr.CRUD_NO_USER
		if (users.data.length > 1 && !groupGet)
			return crudErr.CRUD_GROUP_ERR
		return { statusCode: 200, body: JSON.stringify(users.data) };
	}
	catch (e) { return { statusCode: 404, body: "Couldn't get any user: " + e }; }
}

// Gets a single user by id
export async function _getById(id: string) {
	try {
		const user = await userEntity.get({ id: id }).go();
		if (!user.data)
			return crudErr.CRUD_NO_USER
		return { statusCode: 200, body: JSON.stringify(user) };
	}
	catch (e) { return { statusCode: 404, body: "Couldn't get any user: " + e }; }
}

// Updates a single user by id
export async function _updateById(id: string, newTeam: string) {
	try {
		const patchedUser = await userEntity.patch({ id }).set({ team: newTeam }).go();
		return { statusCode: 201, body: "User updated: " + JSON.stringify(patchedUser.data) };
	}
	catch (e) { return { statusCode: 400, body: "User couldn't be modified: " + e }; }
}

// Updates a single or a group of users by team [name]
export async function _updateByTeam(team: string, newTeam: string, name?: string, groupUpdate?: boolean) {
	try {
		const users = await userEntity.query.byTeamAndName({ team, name }).go();
		if (!users.data || !users.data.length)
			return crudErr.CRUD_NO_USER
		if (users.data.length > 1 && !groupUpdate)
			return crudErr.CRUD_GROUP_ERR
		let body: string = "";
		for (let i = 0; i < users.data.length; i++) {
			try {
				const updatedUser = await userEntity.patch({ id: users.data[i].id }).set({ team: newTeam }).go();
				body += JSON.stringify(updatedUser);
			}
			catch { continue }
		}
		return { statusCode: 200, body: "User(s) succesfully updated: " + body };
	}
	catch (e) { return { statusCode: 404, body: "User was not found: " + e }; }
}

// Deletes a single of multiple users by team [name]
export async function _deleteByTeam(team: string, name?: string, groupDelete?: boolean) {
	try {
		const users = await userEntity.query.byTeamAndName({ team, name }).go();
		if (!users.data || !users.data.length)
			return crudErr.CRUD_NO_USER;
		if (users.data.length > 1 && !groupDelete)
			return crudErr.CRUD_GROUP_ERR;
		console.log(team, users.data, groupDelete)
		let body: string = "";
		for (let i = 0; i < users.data.length; i++) {
			try {
				const deletedUser = await userEntity.delete({ id: users.data[i].id }).go();
				body += JSON.stringify(deletedUser);
			}
			catch { continue }
		}
		return { statusCode: 200, body: "User(s) succesfully deleted: " + body };
	}
	catch (e) { return { statusCode: 404, body: "User(s) couldn't be deleted: " + e }; }
}

// Deletes a single user by id
export async function _deleteById(id: string) {
	try {
		const user = await userEntity.delete({ id }).go();
		return { statusCode: 200, body: "User succesfully deleted: " + JSON.stringify(user.data) };
	}
	catch (e) { return { statusCode: 404, body: "User couldn't be deleted: " + e }; }
}