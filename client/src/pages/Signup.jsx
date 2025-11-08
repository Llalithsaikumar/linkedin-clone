import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api.js";

export default function Signup() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	async function onSubmit(e) {
		e.preventDefault();
		setError("");
		setLoading(true);
		try {
			await api.post("/auth/register", form);
			navigate("/login");
		} catch (err) {
			setError(err?.response?.data?.error || "Signup failed");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<h2>Join LinkedIn</h2>
				<p style={{ textAlign: "center", marginBottom: 24, color: "#666666", fontSize: 14 }}>
					Start building your professional network today
				</p>
				<form onSubmit={onSubmit}>
					<input placeholder="Full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
					<input placeholder="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
					<input placeholder="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
					{error && <p className="error">{error}</p>}
					<button className="btn-primary" disabled={loading} type="submit">
						{loading ? "Creating account..." : "Agree & Join"}
					</button>
				</form>
				<p>Already on LinkedIn? <Link to="/login">Sign in</Link></p>
			</div>
		</div>
	);
}

