import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(() => localStorage.getItem("token") || "");

	useEffect(() => {
		if (!token) return;
		api.setToken(token);
		api.get("/auth/me").then(res => setUser(res.data)).catch(() => {
			setUser(null);
			setToken("");
			localStorage.removeItem("token");
		});
	}, [token]);

	function login(nextToken, nextUser) {
		setToken(nextToken);
		localStorage.setItem("token", nextToken);
		api.setToken(nextToken);
		setUser(nextUser);
	}

	function logout() {
		setUser(null);
		setToken("");
		localStorage.removeItem("token");
		api.setToken("");
	}

	return (
		<AuthContext.Provider value={{ user, token, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}

