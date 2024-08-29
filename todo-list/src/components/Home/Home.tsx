import React, { useEffect, useState } from "react";
import "./Home.css";
import { createTask } from "../../api/tasks/createTask";
import { getTasks } from "../../api/tasks/getTasks";

interface Task {
	title: string;
	description: string;
	datetime: string;
	completed: boolean;
	userId: number;
}

const Home: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [datetime, setDatetime] = useState("");
	const [tasks, setTasks] = useState<Task[]>([]);

	const username = localStorage.getItem("username");
	const userId = localStorage.getItem("userId");
	const token = localStorage.getItem("authToken");

	// Logica para adicionar
	const handleAddTask = async (e: React.FormEvent) => {
		e.preventDefault();

		if (title && datetime && token) {
			const formattedDatetime = new Date(datetime).toISOString();
			const newTask: Task = {
				title,
				description,
				datetime: formattedDatetime,
				userId: Number(userId),
				completed: false,
			};
			await createTask(token, newTask);

			setTasks(
				[...tasks, newTask].sort(
					(a, b) =>
						new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
				)
			);
			setTitle("");
			setDescription("");
			setDatetime("");
		}
	};

	//Logica para pegar as tasks
	useEffect(() => {
		const userTasks = async () => {
			try {
				if (token && userId) {
					const response = await getTasks(token, userId);
					console.log(response.tasks);
					setTasks(response.tasks);
				}
			} catch (error) {
				console.error(error);
			}
		};
		userTasks();
	}, []);

	//Adicionar logica para update
	const handleToggleComplete = (index: number) => {
		const updatedTasks = tasks.map((task, i) =>
			i === index ? { ...task, completed: !task.completed } : task
		);
		setTasks(updatedTasks);
	};

	//Logica para deletar as tasks
	const handleDeleteTask = (index: number) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
	};

	return (
		<div className="home-container">
			<div className="task-form">
				<h2>Bienvenido {username}</h2>
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
									onChange={() => handleToggleComplete(index)}
								/>
								<h3>{task.title}</h3>
								<p>{task.description}</p>
								<time>{task.datetime}</time>
								<button onClick={() => handleDeleteTask(index)}>Excluir</button>
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
