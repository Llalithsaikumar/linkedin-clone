import { Router } from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Create a post
router.post("/", requireAuth, async (req, res) => {
	try {
		const { text, imageUrl } = req.body;
		if (!text) return res.status(400).json({ error: "Text is required" });
		const post = await Post.create({ user: req.userId, text, imageUrl });
		const populated = await post.populate("user", "name");
		return res.status(201).json(populated);
	} catch (err) {
		return res.status(500).json({ error: "Failed to create post" });
	}
});

// Public feed: latest first
router.get("/", async (req, res) => {
	const posts = await Post.find()
		.sort({ createdAt: -1 })
		.populate("user", "name")
		.populate("comments.user", "name");
	return res.json(posts);
});

// Update own post
router.put("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { text } = req.body;
	const post = await Post.findById(id);
	if (!post) return res.status(404).json({ error: "Not found" });
	if (String(post.user) !== String(req.userId)) return res.status(403).json({ error: "Forbidden" });
	post.text = text ?? post.text;
	await post.save();
	const populated = await post.populate("user", "name");
	return res.json(populated);
});

// Delete own post
router.delete("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) return res.status(404).json({ error: "Not found" });
	if (String(post.user) !== String(req.userId)) return res.status(403).json({ error: "Forbidden" });
	await Post.deleteOne({ _id: id });
	return res.json({ ok: true });
});

// Like/Unlike a post (toggle)
router.post("/:id/like", requireAuth, async (req, res) => {
	const { id } = req.params;
	const post = await Post.findById(id);
	if (!post) return res.status(404).json({ error: "Not found" });
	const idx = post.likes.findIndex(u => String(u) === String(req.userId));
	if (idx >= 0) {
		post.likes.splice(idx, 1);
	} else {
		post.likes.push(req.userId);
	}
	await post.save();
	const populated = await Post.findById(id)
		.populate("user", "name")
		.populate("comments.user", "name");
	return res.json(populated);
});

// Add a comment
router.post("/:id/comments", requireAuth, async (req, res) => {
	const { id } = req.params;
	const { text } = req.body;
	if (!text) return res.status(400).json({ error: "Text is required" });
	const post = await Post.findById(id);
	if (!post) return res.status(404).json({ error: "Not found" });
	post.comments.unshift({ user: req.userId, text });
	await post.save();
	const populated = await Post.findById(id)
		.populate("user", "name")
		.populate("comments.user", "name");
	return res.status(201).json(populated);
});

export default router;

