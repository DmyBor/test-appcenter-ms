const axios = require("axios");
const { MS_API_URL } = require("../constants");
const msError = require("../errors/ms-error");
const outputMes = require("../constants/output-messages");

const msApiClient = axios.create({
	baseURL: MS_API_URL
});

/**
 * Function check errors codes and statuses from request
 * and rethrow formatted error
 * @param { Error } err - Error
 * @throw { Error }
 */
const formatReqError = (err) => {
	if (err.code === "ERR_BAD_REQUEST") {
		const resp = err.response;
		if (resp && resp.data) throw Error(resp.data.message);
		if (err.response.status === 401) throw Error(outputMes.tokenInvalid);
		if (err.response.status === 404) throw Error(outputMes.resNotFound);
	}
	if (err.name === "AppcenterError") throw err;

	// TODO Log
	throw Error(outputMes.unexpectedErrorWithLog);
};

/**
 * function to create base url for api requests
 * @param { String } app - application
 * @param { String } user - user name
 * @returns { String } - base url
 */
function createAppsBaseUrl(app, user) {
	if (!app || !user) throw new msError(outputMes.userOrTokenMissing);

	return `apps/${user}/${app}`;
}

async function getUserApps(token) {
	try {
		if (!token) throw new msError(outputMes.missingToken);
		const appInfo = await msApiClient.get("apps", {
			headers: {"X-API-Token": token}
		});
		
		if (appInfo.data) return appInfo.data;
	} catch (e) {
		formatReqError(e);
	}
}

/**
 * Function making request to ms api and return username 
 * @param { String } token - auth token 
 * @returns { String | Error } -  username
 */
async function getUserByToken(token) {
	try {
		if (!token) throw new msError(outputMes.missingToken);

		const userInfo = await msApiClient.get("user", {
			headers: {"X-API-Token": token}
		});
        
		const userName = userInfo.data && userInfo.data.name;

		if (userName) return userName;
		throw new msError(outputMes.userNotFound);
	} catch (e) {
		formatReqError(e);
	}
}


/**
 * 
 * @param { String } app - application name 
 * @param { String } token - auth token
 * @param { String } user - user name
 * @returns { Array | Error } return array of branches or error
 */
async function getAppBranches({app, token, user}) {
	try {
		const baseUrl = createAppsBaseUrl(app, user);

		const branchInfo = await msApiClient.get(`${baseUrl}/branches`, {
			headers: {"X-API-Token": token}
		});

		return branchInfo.data;
	} catch (e) {
		formatReqError(e);
	}
}

/**
 * function to create task for build
 * doing request and return info about task
 * @param { String } app - application name
 * @param { String } token - auth token
 * @param { String } user - user name
 * @param { String } branch - branch name
 * @param { string } targetSource - sha of building commit 
 * @returns { Object | Error } return info about created task for building or error
 */
async function processBuildForBranch({app, token, user, branch, targetSource}) {
	try {
		const baseUrl = createAppsBaseUrl(app, user);
		const data = {sourceVersion : targetSource};
		const branchInfo = await msApiClient.post(`${baseUrl}/branches/${branch}/builds`, data, {
			headers: {"X-API-Token": token},
		});

		return branchInfo.data;
	} catch (e) {
		formatReqError(e);
	}
}

/**
 * Function sending a request to get status of building
 * @param { String } app - application name
 * @param { String } token - auth token
 * @param { String } user - user name
 * @param { Number } buildId - build ID  
 * @returns {Object|Error} - return info about building status, Error otherwise
 */
async function getBuildStatus({app, token, user, buildId}) {
	try {
		const baseUrl = createAppsBaseUrl(app, user);
		const branchInfo = await msApiClient.get(`${baseUrl}/builds/${buildId}`, {
			headers: {"X-API-Token": token},
		});

		return branchInfo.data;
	} catch (e) {
		formatReqError(e);
	}
}
  
module.exports = { 
	getUserByToken,
	getAppBranches,
	processBuildForBranch,
	getBuildStatus,
	getUserApps
};
