import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string
) => {
	const response = await axios.post(`${API_URL}/register`, {
		firstName,
		lastName,
		email,
		password,
	});
	return response.data;
};
