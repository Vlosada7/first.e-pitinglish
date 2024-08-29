import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const getTasks = async (token: string) => {
	const response = await axios.get(`${API_URL}/tasks`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
