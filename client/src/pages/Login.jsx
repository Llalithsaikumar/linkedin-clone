import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			const res = await api.post("/auth/login", form);
			login(res.data.token, res.data.user);
			navigate("/");
		} catch (err) {
			setError(err?.response?.data?.error || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2>Sign in</h2>
				<p style={{ textAlign: "center", marginBottom: 24, color: "#666666", fontSize: 14 }}>
					Stay updated on your professional world
				</p>
				<form onSubmit={onSubmit}>
					<input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
					<input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
					{error && <p className="error">{error}</p>}
					<button className="btn-primary" disabled={loading} type="submit">
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</form>
				<p>Don't have an account? <Link to="/signup">Join now</Link></p>
			</div>
		</div>
	);
}

