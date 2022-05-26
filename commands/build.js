const outputMes = require("../constants/output-messages");
const msError = require("../errors/ms-error");

const { getAllUserData } = require("../store");

const {
	printWarning,
	printSuccess,
	printInfo,
	timeDiff,
	formLogLink,
	printError
} = require("../utils");

const {
	BUILD_COMPLETE_STATUS,
	STATUS_REQUEST_TIMEOUT
} = require("../constants");

const {
	getAppBranches,
	processBuildForBranch,
	getBuildStatus
} = require("../helpers/ms-api");

/**
 * Function to format array of branches for next using
 * @param { Array<Object> } branchesArr - Array with branch info
 * @returns { Array<Object> } return array of objects with branch name, last commit and sha
 */
function getBranchesInfo(branchesArr) {
	// Not sure is branches always has one branch prop
	if (!branchesArr || (branchesArr instanceof Array) === false) {
		return null;
	}

	return branchesArr.map(_branch => {
		const { name, commit } = _branch.branch;
		return { branchName: name, lastCommit: commit.sha, message: commit.commit.message };
	});
}

/**
 * The function polls the api at certain intervals until it receives the desired status,
 * if there is no status, the function will return an error
 * @param { String } app - name of application for getting task
 * @param { String } token - auth token for request
 * @param { String } user - user for request
 * @param { Number } buildId - build ID for which status is requested 
 * @returns { Promise<Object> } - return object with information about build when build was finished otherwise return error
 */
async function getTaskInfo({app, token, user, buildId}) {
	return await new Promise((resolve, reject) => {
		const timerFunc = async () => {
			try {
				const buildStatus = await getBuildStatus({app, token, user, buildId});
				if (!buildStatus || !buildStatus.status) throw new msError(outputMes.statusMissing); 

				if (buildStatus.status === BUILD_COMPLETE_STATUS) {
					resolve(buildStatus);
					return;
				}


				setTimeout(timerFunc, STATUS_REQUEST_TIMEOUT);
			} catch (e) {
				reject(e);
			}
		};

		setTimeout(timerFunc, STATUS_REQUEST_TIMEOUT);
	});
}

/**
 * Command for building all branches
 * Function fetching all branches from the server
 * After that function making request for building 
 * and get statuses until it wasn't done 
 * @param { String } app - application name for which branches are recognized 
 * @returns null
 */
async function buildAllBranches(app) {
	const { token, user } = getAllUserData();
	if (!token || !user) throw new msError(outputMes.notAuth);

	printInfo(outputMes.fetchingBranches);
	const result = await getAppBranches({app, token, user});
	const branchesInfo = getBranchesInfo(result);
	if (!branchesInfo) {
		printWarning(outputMes.branchNotFound);
		return;
	}

	await Promise.all(
		branchesInfo.map(async (_branch) => {
			try {
				const { branchName: branch , lastCommit: targetSource } = _branch;
				const createdProcess = await processBuildForBranch({app, token, user, branch, targetSource});
				if (!createdProcess.id) throw new msError(outputMes.idMissing);

				printInfo(outputMes.buildCreated(branch, targetSource, createdProcess.id));
				const taskResult = await getTaskInfo({app, token, user, buildId: createdProcess.id});

				const { status, result, startTime, finishTime } = taskResult;
				const time = timeDiff(startTime, finishTime);
				const link = formLogLink(user, app, branch, taskResult.id);

				printSuccess(outputMes.buildFinished(branch, status, result, time, link));
			} catch (e) {
				printError(e.message);
			}
		}));
}

/**
 * Command to get all branches of the app
 * Function making request on server and displays all branches for application
 * @param { String } app - application name for which branches are recognized 
 * @returns null
 */
async function getBranchList(app) {
	const { token, user } = getAllUserData();
	if (!token || !user) throw new msError(outputMes.notAuth);

	printInfo(outputMes.fetchingBranches);
	const result = await getAppBranches({app, token, user});
	const branchesInfo = getBranchesInfo(result);
	if (!branchesInfo) {
		printWarning(outputMes.branchNotFound);
		return;
	}

	branchesInfo.forEach(_branch => {
		printSuccess(outputMes.formBranchInfo(_branch.branchName, _branch.message));
	});

}

module.exports = {
	getBranchList,
	buildAllBranches
};
