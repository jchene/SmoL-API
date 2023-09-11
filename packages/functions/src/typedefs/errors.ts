export const CRUD_NO_USER = { 
	statusCode: 404, 
	body: "Error: No user was found" 
};

export const CRUD_GROUP_ERR = { 
	statusCode: 400, 
	body: "Error: Multiple users were found but group parameter is false" 
};

export const INPUT_MISSING_TN = { 
	statusCode: 400, 
	body: "Error: Please define team and name" 
};

export const INPUT_MISSING_TI = { 
	statusCode: 400, 
	body: "Error: Please define: team [name] | id" 
};

export const INPUT_MISSING_N_T = { 
	statusCode: 400, 
	body: "Error: Please define: team [name] new_team | id new_team" 
};