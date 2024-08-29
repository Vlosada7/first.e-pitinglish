import { useState, useEffect } from "react";

const useAuth = () => {
	const [token, setToken] = useState<string | null>(
		localStorage.getItem("authToken")
	);

	useEffect(() => {
		if (token) {
			localStorage.setItem("authToken", token);
		} else {
			localStorage.removeItem("authToken");
		}
	}, [token]);

	const login = (newToken: string) => {
		setToken(newToken);
	};

	const logout = () => {
		setToken(null);
	};

	return { token, login, logout };
};

export default useAuth;
