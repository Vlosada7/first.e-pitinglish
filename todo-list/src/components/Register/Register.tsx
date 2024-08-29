import React, { useState } from "react";
import { register } from "../../api/auth/register";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Spinner from "../Spinner/Spinner";

const Register: React.FC = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Verificar se as senhas coincidem
		if (password !== confirmPassword) {
			setErrorMessage("As senhas devem ser iguais");
			return;
		}

		setErrorMessage("");

		// Lógica para o registro do usuário
		try {
			const response = await register(firstName, lastName, email, password);
			if (response.status === 400) {
				setErrorMessage(response.message);
			} else if (response.status === 500) {
				setErrorMessage(response.message);
			} else {
				alert("Registrado con succeso");
				navigate("/");
			}
		} catch (error) {
			setErrorMessage("Error interno del server");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="register-container">
			<h2>Registro</h2>
			{loading ? (
				<Spinner /> // Mostra o spinner enquanto estiver carregando
			) : (
				<form onSubmit={handleRegister}>
					<input
						type="text"
						placeholder="Nombre"
						value={firstName}
						onChange={(e) => setFirstName(e.target.value)}
						required
					/>
					<input
						type="text"
						placeholder="Apellido"
						value={lastName}
						onChange={(e) => setLastName(e.target.value)}
						required
					/>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Contraseña"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Confirmar Contraseña"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					{errorMessage && <p className="error-message">{errorMessage}</p>}
					<button type="submit">Registrar</button>
				</form>
			)}
		</div>
	);
};

export default Register;
