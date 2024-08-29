import React, { useEffect, useState } from "react";
import "./Home.css";
import { createTask } from "../../api/tasks/createTask";
import { getTasks } from "../../api/tasks/getTasks";
import { updateTask } from "../../api/tasks/updateTask";
import { deleteTask } from "../../api/tasks/deleteTask";

interface Task {
	id: number;
	title: string;
	description: string;
	dueDate: string;
	completed: boolean;
	userId: number;
}

// Função para formatar a data
const formatDatetime = (datetime: string | undefined) => {
	if (!datetime) {
		return "Data não disponível";
	}

	const date = new Date(datetime);

	if (isNaN(date.getTime())) {
		return "Data inválida";
	}

	const day = String(date.getDate()).padStart(2, "0");
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const year = date.getFullYear();
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");

	return `${day}/${month}/${year} - ${hours}:${minutes}`;
};

// Teste a função com uma data ISO fixa
console.log(formatDatetime("2024-12-12T12:12:00Z"));

const Home: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [datetime, setDatetime] = useState("");
	const [tasks, setTasks] = useState<Task[]>([]);
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("authToken");

	// Lógica para adicionar
	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();

		if (title && datetime && token) {
			const formattedDatetime = new Date(datetime).toISOString();
			const newTask: Task = {
				id: 0, // O ID real será atribuído pelo backend
				title,
				description,
				dueDate: formattedDatetime,
				userId: Number(userId),
				completed: false,
			};
			await createTask(token, newTask);

			setTasks(
				[...tasks, newTask].sort(
					(a, b) =>
						new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
				)
			);
			setTitle("");
			setDescription("");
			setDatetime("");
		}
	};

	// Lógica para pegar as tasks
	useEffect(() => {
		const userTasks = async () => {
			try {
				if (token && userId) {
					const response = await getTasks(token, userId);
					setTasks(response.tasks);
					console.log(response.tasks);
				}
			} catch (error) {
				console.error(error);
			}
		};
		userTasks();
	}, [token, userId]);

	// Lógica para atualizar (toggle `completed`)
	const handleToggleComplete = async (task: Task) => {
		try {
			if (token && userId) {
				const updatedTask = await updateTask(token, {
					taskId: task.id,
					userId: Number(userId),
				});

				// Atualize a lista de tarefas localmente
				const updatedTasks = tasks.map((t) =>
					t.id === task.id ? { ...t, completed: updatedTask.isCompleted } : t
				);
				setTasks(updatedTasks);
			}
		} catch (error) {
			console.error("Erro ao atualizar tarefa:", error);
		}
	};

	// Lógica para deletar as tasks (ainda não implementada no backend)
	const handleDeleteTask = async (taskId: number) => {
		try {
			if (token && userId) {
				await deleteTask(token, userId, taskId.toString()); // Chama a API deleteTask

				// Remove a tarefa deletada do estado local
				const updatedTasks = tasks.filter((task) => task.id !== taskId);
				setTasks(updatedTasks);
			}
		} catch (error) {
			console.error("Erro ao deletar tarefa:", error);
		}
	};

	return (
		<div className="home-container">
			<div className="task-form">
				<h2>Agregar nueva tarea</h2>
				<form onSubmit={handleAddTask}>
					<input
						type="text"
						placeholder="Título"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Descripción (opcional)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						type="datetime-local"
						value={datetime}
						onChange={(e) => setDatetime(e.target.value)}
						required
					/>
					<button type="submit">Agregar</button>
				</form>
			</div>
			<div className="task-list">
				<h2>Tareas</h2>
				{tasks.length > 0 ? (
					<ul>
						{tasks.map((task, index) => (
							<li key={index} className={task.completed ? "completed" : ""}>
								<input
									type="checkbox"
									checked={task.completed}
									onChange={() => handleToggleComplete(task)}
								/>
								<h3>{task.title}</h3>
								<p>{task.description}</p>
								<time>{formatDatetime(task.dueDate)}</time>
								<button onClick={() => handleDeleteTask(task.id)}>
									Excluir
								</button>
							</li>
						))}
					</ul>
				) : (
					<p>No se agregaron tareas.</p>
				)}
			</div>
		</div>
	);
};

export default Home;
