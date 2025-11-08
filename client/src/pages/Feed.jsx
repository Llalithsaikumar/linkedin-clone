import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Avatar({ name, size = 48 }) {
	const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
	return (
		<div className="avatar" style={{ width: size, height: size, fontSize: size * 0.375 }}>
			{initials}
		</div>
	);
}

function PostCard({ post, user, onDelete, onEdit, onLike, onAddComment }) {
	const isLiked = user && post.likes?.some(likeId => String(likeId) === String(user.id));
	const likeCount = post.likes?.length || 0;
	const commentCount = post.comments?.length || 0;
	
	return (
		<div className="post">
			<div className="post-header">
				<Avatar name={post.user?.name} />
				<div className="post-header-info">
					<h3>
						<Link to={`/u/${post.user?._id}`}>{post.user?.name || "Unknown"}</Link>
					</h3>
					<time>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</time>
				</div>
			</div>
			<div className="post-content">{post.text}</div>
			{post.imageUrl && (
				<img 
					src={post.imageUrl.startsWith("http") ? post.imageUrl : `${import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:4000"}${post.imageUrl}`} 
					alt="" 
					className="post-image"
				/>
			)}
			<div className="post-actions">
				<button 
					className={`post-action-btn ${isLiked ? "liked" : ""}`}
					onClick={onLike}
				>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A.5.5 0 0013 3H4a1 1 0 00-1 1v7a1 1 0 001 1h1.46l4.3 4.3A2 2 0 0012 18h6.5a2.5 2.5 0 002.5-2.5v-1a.55.55 0 00-.04-.2l-1.5-2.3zM5 11H4V5h9l.5 1.5-3.15 3.15A1 1 0 0110.5 11H5zm13.5 5H12l-2.5-2.5h7.5a.5.5 0 01.5.5v1a.5.5 0 01-.5.5z"/>
					</svg>
					<span>Like</span>
					{likeCount > 0 && <span>({likeCount})</span>}
				</button>
				<button className="post-action-btn" onClick={() => document.getElementById(`comment-${post._id}`)?.focus()}>
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M7 9h10v2H7zm0 4h7v2H7zm12-9H5a2 2 0 00-2 2v10a2 2 0 002 2h4l4 4 4-4h4a2 2 0 002-2V6a2 2 0 00-2-2z"/>
					</svg>
					<span>Comment</span>
					{commentCount > 0 && <span>({commentCount})</span>}
				</button>
				{user && post.user && String(post.user._id) === String(user.id) && (
					<>
						<button className="post-action-btn" onClick={onEdit}>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
							</svg>
							<span>Edit</span>
						</button>
						<button className="post-action-btn danger" onClick={onDelete}>
							<svg viewBox="0 0 24 24" fill="currentColor">
								<path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
							</svg>
							<span>Delete</span>
						</button>
					</>
				)}
			</div>
			{onAddComment && (
				<div className="comments-section">
					<CommentList post={post} />
					<CommentComposer postId={post._id} onSubmit={onAddComment} />
				</div>
			)}
		</div>
	);
}

function CommentList({ post }) {
	if (!post.comments || post.comments.length === 0) return null;
	
	return (
		<div>
			{post.comments.map(c => (
				<div key={c._id} className="comment">
					<div className="comment-header">
						<Avatar name={c.user?.name} size={32} />
						<div>
							<div className="comment-author">
								<Link to={`/u/${c.user?._id}`}>{c.user?.name || "User"}</Link>
							</div>
							<div className="comment-time">
								{new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
							</div>
						</div>
					</div>
					<div className="comment-text">{c.text}</div>
				</div>
			))}
		</div>
	);
}

function CommentComposer({ postId, onSubmit }) {
	const [text, setText] = useState("");
	
	function handleSubmit(e) {
		e.preventDefault();
		if (!text.trim()) return;
		onSubmit(text).then(() => setText(""));
	}
	
	return (
		<form className="comment-composer" onSubmit={handleSubmit}>
			<input 
				id={`comment-${postId}`}
				placeholder="Add a comment..." 
				value={text} 
				onChange={e => setText(e.target.value)}
			/>
			<button type="submit" className="btn-primary" disabled={!text.trim()}>Post</button>
		</form>
	);
}

export default function Feed() {
	const { user } = useAuth();
	const [text, setText] = useState("");
	const [imageFile, setImageFile] = useState(null);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [editingId, setEditingId] = useState(null);
	const [editText, setEditText] = useState("");

	async function load() {
		const res = await api.get("/posts");
		setPosts(res.data);
	}

	useEffect(() => {
		load();
	}, []);

	async function createPost(e) {
		e.preventDefault();
		if (!text.trim()) return;
		setLoading(true);
		try {
			let imageUrl;
			if (imageFile) {
				const form = new FormData();
				form.append("image", imageFile);
				const apiBase = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
				const uploadUrl = apiBase.replace("/api", "") + "/api/upload";
				const up = await fetch(uploadUrl, { method: "POST", body: form });
				const j = await up.json();
				imageUrl = j.url;
			}
			const res = await api.post("/posts", { text, imageUrl });
			setPosts(p => [res.data, ...p]);
			setText("");
			setImageFile(null);
		} finally {
			setLoading(false);
		}
	}

	async function deletePost(id) {
		await api.delete(`/posts/${id}`);
		setPosts(p => p.filter(x => x._id !== id));
	}

	async function likePost(id) {
		const res = await api.post(`/posts/${id}/like`);
		setPosts(p => p.map(x => x._id === id ? res.data : x));
	}

	function startEdit(p) {
		setEditingId(p._id);
		setEditText(p.text);
	}

	async function submitEdit(id) {
		const res = await api.put(`/posts/${id}`, { text: editText });
		setPosts(p => p.map(x => x._id === id ? res.data : x));
		setEditingId(null);
		setEditText("");
	}

	async function addComment(id, commentText) {
		const res = await api.post(`/posts/${id}/comments`, { text: commentText });
		setPosts(p => p.map(x => x._id === id ? res.data : x));
	}

	return (
		<div className="main-content">
			<form className="composer" onSubmit={createPost}>
				<div className="composer-header">
					<Avatar name={user?.name} />
					<div style={{ flex: 1 }}>
						<textarea 
							placeholder={`What do you want to talk about?`} 
							value={text} 
							onChange={e => setText(e.target.value)}
						/>
					</div>
				</div>
				{imageFile && (
					<div style={{ marginBottom: 12, padding: 8, background: "#f3f2ef", borderRadius: 4 }}>
						<span style={{ fontSize: 14, color: "#666" }}>Selected: {imageFile.name}</span>
						<button 
							type="button" 
							onClick={() => setImageFile(null)}
							style={{ marginLeft: 8, padding: "4px 8px", fontSize: 12 }}
							className="btn-secondary"
						>
							Remove
						</button>
					</div>
				)}
				<div className="composer-actions">
					<div className="composer-actions-left">
						<div className="file-input-wrapper">
							<input 
								type="file" 
								accept="image/*" 
								id="image-upload"
								onChange={e => setImageFile(e.target.files?.[0] || null)}
							/>
							<label htmlFor="image-upload" className="file-input-label">
								<svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 20, height: 20 }}>
									<path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
								</svg>
								<span>Photo</span>
							</label>
						</div>
					</div>
					<div className="composer-actions-right">
						<button 
							type="submit" 
							className="btn-primary" 
							disabled={loading || !text.trim()}
						>
							{loading ? "Posting..." : "Post"}
						</button>
					</div>
				</div>
			</form>
			<div className="posts">
				{posts.map(p => (
					<div key={p._id}>
						{editingId === p._id ? (
							<div className="card">
								<textarea 
									value={editText} 
									onChange={e => setEditText(e.target.value)}
									style={{ marginBottom: 12 }}
								/>
								<div className="composer-actions-right">
									<button 
										onClick={() => submitEdit(p._id)} 
										disabled={!editText.trim()}
										className="btn-primary"
									>
										Save
									</button>
									<button 
										onClick={() => { setEditingId(null); setEditText(""); }}
										className="btn-secondary"
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<PostCard
								post={p}
								user={user}
								onLike={() => likePost(p._id)}
								onEdit={user && p.user && String(p.user._id) === String(user.id) ? () => startEdit(p) : undefined}
								onDelete={user && p.user && String(p.user._id) === String(user.id) ? () => deletePost(p._id) : undefined}
								onAddComment={(text) => addComment(p._id, text)}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
}

