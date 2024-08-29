import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const createTask = async (token: string, taskData: any) => {
	const response = await axios.post(`${API_URL}/tasks`, taskData, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
