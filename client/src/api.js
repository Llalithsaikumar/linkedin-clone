import axios from "axios";

const instance = axios.create({
	baseURL: import.meta?.env?.VITE_API_URL || "http://localhost:4000/api",
	withCredentials: false
});

function setToken(token) {
	if (token) {
		instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	} else {
		delete instance.defaults.headers.common["Authorization"];
	}
}

export const api = {
	get: (url, config) => instance.get(url, config),
	post: (url, data, config) => instance.post(url, data, config),
	put: (url, data, config) => instance.put(url, data, config),
	delete: (url, config) => instance.delete(url, config),
	setToken
};

