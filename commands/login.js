const { printSuccess } = require("../utils");

const { setUserData } = require("../store");
const { getUserByToken } = require("../helpers/ms-api");
const outputMes = require("../constants/output-messages");

/**
 * Command to login user and save data to store
 * @param { String } token 
 */
async function login(token) {
	const user = await getUserByToken(token);
	setUserData("user", user);
	setUserData("token", token);

	printSuccess(`${outputMes.successfulLogin} ${user}`);
}

module.exports = login;