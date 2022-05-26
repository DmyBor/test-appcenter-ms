const { printInfo, printWarning } = require("../utils");

const { getUserApps } = require("../helpers/ms-api");
const { getUserData } = require("../store");
const outputMes = require("../constants/output-messages");
const msError = require("../errors/ms-error");

/**
 * Command to find user applications
 */
async function findUserApps() {
	const token = getUserData("token");
	if (!token) throw new msError(outputMes.notAuth);

	const apps = await getUserApps(token);

	if (apps && apps.length) {
		apps.forEach(_app => {
			const { name, os, platform } = _app;
			printInfo(outputMes.foundApplication(name, os, platform));
		});
		return;
	}

	printWarning(outputMes.appsNotFound);
}

module.exports = findUserApps;