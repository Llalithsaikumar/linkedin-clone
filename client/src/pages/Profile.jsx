import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api.js";

function Avatar({ name, size = 80 }) {
	const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
	return (
		<div className="avatar" style={{ width: size, height: size, fontSize: size * 0.375 }}>
			{initials}
		</div>
	);
}

export default function Profile() {
	const { id } = useParams();
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		setLoading(true);
		api.get(`/users/${id}`)
			.then(res => setData(res.data))
			.catch(() => setData(null))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) {
		return (
			<div className="main-content">
				<div className="card">
					<p>Loading...</p>
				</div>
			</div>
		);
	}
	
	if (!data) {
		return (
			<div className="main-content">
				<div className="card">
					<p>User not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="main-content">
			<div className="profile-header">
				<div style={{ display: "flex", alignItems: "center", gap: 24 }}>
					<Avatar name={data.user.name} size={120} />
					<div>
						<h1>{data.user.name}</h1>
						<p>{data.user.email}</p>
						<p style={{ marginTop: 8, fontSize: 14, color: "#666666" }}>
							Member since {new Date(data.user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
						</p>
					</div>
				</div>
			</div>
			<div style={{ marginTop: 24 }}>
				<h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#000000e6" }}>
					Posts ({data.posts.length})
				</h2>
				<div className="posts">
					{data.posts.length === 0 ? (
						<div className="card">
							<p style={{ color: "#666666", textAlign: "center" }}>No posts yet</p>
						</div>
					) : (
						data.posts.map(p => (
							<div key={p._id} className="post">
								<div className="post-header">
									<Avatar name={p.user?.name} />
									<div className="post-header-info">
										<h3>{p.user?.name}</h3>
										<time>{new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
									</div>
								</div>
								<div className="post-content">{p.text}</div>
								{p.imageUrl && (
									<img 
										src={p.imageUrl.startsWith("http") ? p.imageUrl : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000"}${p.imageUrl}`} 
										alt="" 
										className="post-image"
									/>
								)}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

