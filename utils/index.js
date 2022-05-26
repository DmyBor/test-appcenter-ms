const { MS_URL } = require("../constants");
const chalk = require("chalk");

/**
 * Function to calculate diff between two dates
 * @param { Date } _startTime - start date
 * @param { Date } _finishTime - end date
 * @returns { Number } - return diff between date in seconds 
 */
const timeDiff = (_startTime, _finishTime) => {
	const startTime = new Date(_startTime);
	const finishTime = new Date(_finishTime);
	const timeDiff = Math.abs(startTime.getTime() - finishTime.getTime());

	return Math.floor(timeDiff / 1000); // in Seconds
};

/**
 * Function create link to build log
 * @param { String } user 
 * @param { String } app 
 * @param { String } branch 
 * @param { Number } buildId - Indemnificator of build
 * @returns { String } - link to logs
 */
const formLogLink = (user, app, branch, buildId) => {
	return `${MS_URL}/users/${user}/apps/${app}/build/branches/${branch}/builds/${buildId}`;
};

const printError = (message) => {
	console.log(
		chalk.red.bold(message)
	);
};

const printSuccess = (message) => {
	console.log(
		chalk.green.bold(message)
	);
};

const printInfo = (message) => {
	console.log(
		chalk.blueBright.bold(message)
	);
};

const printWarning = (message) => {
	console.log(
		chalk.yellow.bold(message)
	);
};

module.exports = {
	timeDiff,
	formLogLink,
	printError,
	printSuccess,
	printInfo,
	printWarning
};
