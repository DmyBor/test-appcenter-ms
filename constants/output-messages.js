const buildFinished = (branch, status, result, time, link) => {
	return `<${branch}> build finished with status ${status} and result ${result} in ${time} s. Link to build logs: ${link}`;
};

const formBranchInfo = (name, message) => {
	return `Branch <${name}>, last commit message: <${message}>`;
};

const buildCreated = (branch, targetSource, id) => {
	return `Created build for branch <${branch}> commit <${targetSource}>, build ID: ${id}`;
};

const foundApplication = (name, os, platform) => {
	return `Found application <${name}> for os <${os}> and platform <${platform}>`;
};

module.exports = {
	successfulLogin: "Successful login:",
	fetchingBranches: "Fetching branches",
	branchNotFound: "Branches not found",
	tokenInvalid: "Token is invalid",
	resNotFound: "Resource not found",
	userNotFound: "User not found for this token",
	userOrTokenMissing: "User or app are missing",
	missingToken: "Token is missing",
	statusMissing: "Couldn't fetch status correctly",
	idMissing: "Missing id from task",
	unexpectedErrorWithLog: "Unexpected error, see log:",
	argNotFound: "Argument not found",
	notAuth: "Token not found. You need to run login command first",
	appsNotFound: "Application list empty",
	formBranchInfo,
	buildCreated,
	buildFinished,
	foundApplication
};
