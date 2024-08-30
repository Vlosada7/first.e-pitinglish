import React, { useEffect, useState } from "react";
import "./Home.css";
import { createTask } from "../../api/tasks/createTask";
import { getTasks } from "../../api/tasks/getTasks";
import { updateTask } from "../../api/tasks/updateTask";
import { deleteTask } from "../../api/tasks/deleteTask";
import Spinner from "../Spinner/Spinner";

interface Task {
	id: number;
	title: string;
	description: string;
	dueDate: string;
	isCompleted: boolean;
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

const Home: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [datetime, setDatetime] = useState("");
	const [tasks, setTasks] = useState<Task[]>([]);
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("authToken");
	const [loadingCreateTask, setLoadingCreateTask] = useState(false);
	const [loadingTasks, setLoadingTasks] = useState<boolean[]>([]);
	const [error, setError] = useState("");

	// Lógica para adicionar
	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoadingCreateTask(true);

		if (title && datetime && token) {
			try {
				const formattedDatetime = new Date(datetime).toISOString();
				const newTask: Task = {
					id: 0, // O ID real será atribuído pelo backend
					title,
					description,
					dueDate: formattedDatetime,
					userId: Number(userId),
					isCompleted: false,
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
			} catch (error) {
				setError("Problema ao criar a task");
			} finally {
				setLoadingCreateTask(false);
			}
		}
	};

	// Lógica para pegar as tasks
	useEffect(() => {
		const userTasks = async () => {
			setLoadingCreateTask(true);
			try {
				if (token && userId) {
					const response = await getTasks(token, userId);
					setTasks(response.tasks);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoadingCreateTask(false);
			}
		};
		userTasks();
	}, [token, userId]);

	// Lógica para atualizar (toggle isCompleted)
	const handleToggleComplete = async (task: Task, index: number) => {
		const newLoadingTasks = [...loadingTasks];
		newLoadingTasks[index] = true;
		setLoadingTasks(newLoadingTasks);
		try {
			if (token && userId) {
				const updatedTask = await updateTask(token, {
					taskId: task.id,
					userId: Number(userId),
				});

				// Atualize a lista de tarefas localmente
				const updatedTasks = tasks.map((t) =>
					t.id === task.id ? { ...t, isCompleted: updatedTask.isCompleted } : t
				);
				setTasks(updatedTasks);
			}
		} catch (error) {
			console.error("Erro ao atualizar tarefa:", error);
		} finally {
			newLoadingTasks[index] = false;
			setLoadingTasks(newLoadingTasks);
		}
	};

	// Lógica para deletar as tasks
	const handleDeleteTask = async (taskId: number, index: number) => {
		const newLoadingTasks = [...loadingTasks];
		newLoadingTasks[index] = true;
		setLoadingTasks(newLoadingTasks);
		try {
			if (token && userId) {
				await deleteTask(token, userId, taskId.toString());

				// Remove a tarefa deletada do estado local
				const updatedTasks = tasks.filter((task) => task.id !== taskId);
				setTasks(updatedTasks);
				newLoadingTasks.splice(index, 1); // Remove o estado de loading da task deletada
				setLoadingTasks(newLoadingTasks);
			}
		} catch (error) {
			console.error("Erro ao deletar tarefa:", error);
		}
	};

	// Filtra as tarefas pendentes e concluídas
	const pendingTasks = tasks.filter((task) => !task.isCompleted);
	const completedTasks = tasks.filter((task) => task.isCompleted);

	return (
		<div className="home-container">
			<div className="task-form">
				<h2>Agregar nueva tarea</h2>
				{loadingCreateTask ? (
					<Spinner />
				) : (
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
				)}
			</div>

			<div className="task-list">
				<h2>Tareas Pendientes</h2>
				{pendingTasks.length > 0 ? (
					<ul>
						{pendingTasks.map((task, index) => (
							<li key={index} className="task-item">
								{loadingTasks[index] ? (
									<Spinner />
								) : (
									<>
										<div className="task-info">
											<h3>{task.title}</h3>
											<p>{task.description}</p>
										</div>
										<div className="task-actions">
											<time>{formatDatetime(task.dueDate)}</time>
											<input
												type="checkbox"
												checked={task.isCompleted}
												onChange={() => handleToggleComplete(task, index)}
											/>
											<button onClick={() => handleDeleteTask(task.id, index)}>
												Excluir
											</button>
										</div>
									</>
								)}
							</li>
						))}
					</ul>
				) : (
					<p>No se agregaron tareas.</p>
				)}
			</div>

			<div className="task-list">
				<h2>Tareas Completadas</h2>
				{completedTasks.length > 0 ? (
					<ul>
						{completedTasks.map((task, index) => (
							<li key={index} className="task-item completed">
								{loadingTasks[index] ? (
									<Spinner />
								) : (
									<>
										<div className="task-info">
											<h3>{task.title}</h3>
											<p>{task.description}</p>
										</div>
										<div className="task-actions">
											<time>{formatDatetime(task.dueDate)}</time>
											<input
												type="checkbox"
												checked={task.isCompleted}
												onChange={() => handleToggleComplete(task, index)}
											/>
											<button onClick={() => handleDeleteTask(task.id, index)}>
												Excluir
											</button>
										</div>
									</>
								)}
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