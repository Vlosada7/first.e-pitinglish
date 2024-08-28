import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Vamos adicionar estilos específicos para essa página

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();

		if (email === "teste@teste.com" && password === "123123") {
			navigate("/home");
		} else {
			setError("Email ou senha inválidos!");
		}
	};

	const handleRegisterRedirect = () => {
		navigate("/register"); // Redireciona para a página de registro
	};
	return (
		<div className="login-container">
			<h1>ToDo List TESTE</h1>
			<p>Organize suas tarefas diárias de maneira simples e eficiente.</p>

			<form className="login-form" onSubmit={handleLogin}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Senha"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>

				{error && <p className="error">{error}</p>}

				<button type="submit" className="login-button">
					Entrar
				</button>

				<button
					type="button"
					className="register-button"
					onClick={handleRegisterRedirect}
				>
					Cadastre-se
				</button>
			</form>
		</div>
	);
};

export default Login;
