import React, { useState } from "react";
import "./Home.css";

interface Task {
	title: string;
	description: string;
	datetime: string;
	completed: boolean;
}

const Home: React.FC = () => {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [datetime, setDatetime] = useState("");
	const [tasks, setTasks] = useState<Task[]>([]);

	const handleAddTask = (e: React.FormEvent) => {
		e.preventDefault();

		if (title && datetime) {
			const newTask: Task = { title, description, datetime, completed: false };
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

	const handleToggleComplete = (index: number) => {
		const updatedTasks = tasks.map((task, i) =>
			i === index ? { ...task, completed: !task.completed } : task
		);
		setTasks(updatedTasks);
	};

	const handleDeleteTask = (index: number) => {
		const updatedTasks = tasks.filter((_, i) => i !== index);
		setTasks(updatedTasks);
	};

	return (
		<div className="home-container">
			<div className="task-form">
				<h2>Adicionar Nova Tarefa</h2>
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
						placeholder="Descrição (opcional)"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
					<input
						type="datetime-local"
						value={datetime}
						onChange={(e) => setDatetime(e.target.value)}
						required
					/>
					<button type="submit">Adicionar</button>
				</form>
			</div>
			<div className="task-list">
				<h2>Tarefas</h2>
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
					<p>Nenhuma tarefa adicionada.</p>
				)}
			</div>
		</div>
	);
};

export default Home;
