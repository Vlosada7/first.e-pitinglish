import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

interface UpdateTaskData {
	taskId: number;
	userId: number;
}

export const updateTask = async (token: string, data: UpdateTaskData) => {
	try {
		const response = await axios.put(
			`${API_URL}/task`, // Alvo da requisição PUT
			{
				taskId: data.taskId,
				userId: data.userId, // Envia `taskId` e `userId` no corpo da requisição
			},
			{
				headers: {
					Authorization: `Bearer ${token}`, // Envia o token no header
				},
			}
		);

		return response.data; // Retorna a task atualizada
	} catch (error) {
		console.error("Erro ao atualizar tarefa:", error);
		throw error;
	}
};
