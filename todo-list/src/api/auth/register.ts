import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const register = async (
	firstName: string,
	lastName: string,
	email: string,
	password: string
) => {
	try {
		const response = await axios.post(`${API_URL}/register`, {
			firstName,
			lastName,
			email,
			password,
		});

		if (!response.status) {
			throw new Error("Erro ao registrar usuário");
		}

		return response.data;
	} catch (error) {
		console.error("Erro:", error);
		throw error; // Rethrow para ser tratado na interface do usuário se necessário
	}
};
