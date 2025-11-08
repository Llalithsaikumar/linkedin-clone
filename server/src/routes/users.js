import { Router } from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";

const router = Router();

// Get user profile and their posts
router.get("/:id", async (req, res) => {
	const { id } = req.params;
	const user = await User.findById(id).select("name email createdAt");
	if (!user) return res.status(404).json({ error: "Not found" });
	const posts = await Post.find({ user: id })
		.sort({ createdAt: -1 })
		.populate("user", "name")
		.populate("comments.user", "name");
	return res.json({ user, posts });
});

export default router;

