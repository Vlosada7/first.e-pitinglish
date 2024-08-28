import React, { useState } from "react";
import "./Register.css";

const Register: React.FC = () => {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState(""); 
	const [errorMessage, setErrorMessage] = useState("");

	const handleRegister = (e: React.FormEvent) => {
		e.preventDefault();

		// Verificar se as senhas coincidem
		if (password !== confirmPassword) {
			setErrorMessage("As senhas devem ser iguais");
			return;
		}

		setErrorMessage("");

		// Lógica para o registro do usuário
		console.log("Registrando:", { firstName, lastName, email, password });
	};

	return (
		<div className="register-container">
			<h2>Registro</h2>
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
		</div>
	);
};

export default Register;
