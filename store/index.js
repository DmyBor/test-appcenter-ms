const store = new (require("conf"))();

const setUserData = (key, val) => store.set(key, val);
const getUserData = key => store.get(key);

/**
 * Function to get username and token from store
 * @returns { Object | Error } - returns token and user id success, else throws error
 */
const getAllUserData = () => {
	const { token, user } = store.store;

	return { token, user };
};

module.exports = {
	setUserData,
	getUserData,
	getAllUserData
};