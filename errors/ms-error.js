/**
 * Custom Error class
 */
class msError extends Error {
	constructor(message) {
		super(message);
		this.name = "AppcenterError";
	}
}

module.exports = msError;
