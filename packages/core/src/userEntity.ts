import { Entity } from "electrodb";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Table } from "sst/node/table";

const region = "eu-west-1";
const table = Table.UserTable.tableName
const client = new DocumentClient({ region });

export const userEntity = new Entity({
	model: {
		service: "UserService",
		entity: "UserEntity",
		version: "1",
	},
	attributes: {
		id: { type: "string" },
		name: { type: "string" },
		team: { type: "string" },
	},
	indexes: {
		byId: {
			pk: {
				field: "pk",
				composite: ["id"],
			},
			sk: {
				field: "sk",
				composite: [],
			},
		},
		byTeamAndName: {
			index: "gsi1",
			pk: {
				field: "gsi1pk",
				composite: ["team"],
			},
			sk: {
				field: "gsi1sk",
				composite: ["name"],
			},
		},
	},
}, {
	client,
	table
});
