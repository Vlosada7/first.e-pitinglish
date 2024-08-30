import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/auth/login";
import "./Login.css";
import Spinner from "../Spinner/Spinner";

const Login: React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const response = await login(email, password);
			localStorage.setItem("authToken", response.token);
			localStorage.setItem("username", response.user.firstName);
			localStorage.setItem("userId", response.user.id);
			navigate("/home");
		} catch (error) {
			setError("Email ou senha inválidos!");
		} finally {
			setLoading(false);
		}
	};

	const handleRegisterRedirect = () => {
		navigate("/register");
	};
	return (
		<div className="login-container">
			<h1>ToDo List</h1>
			<p>Organiza tus tareas diarias de una forma sencilla y eficaz.</p>

			{loading ? (
				<Spinner /> // Mostra o spinner enquanto estiver carregando
			) : (
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
						Login
					</button>

					<button
						type="button"
						className="register-button"
						onClick={handleRegisterRedirect}
					>
						Registro
					</button>
				</form>
			)}
		</div>
	);
};

export default Login;
