import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

export const deleteTask = async (
	token: string,
	userId: string,
	taskId: string
) => {
	try {
		const response = await axios.delete(
			`${API_URL}/tasks/${userId}/${taskId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
		throw error;
	}
};
