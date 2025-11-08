import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!name || !email || !password) {
			return res.status(400).json({ error: "Name, email and password are required" });
		}
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(409).json({ error: "Email already in use" });
		}
		const passwordHash = await User.hashPassword(password);
		const user = await User.create({ name, email, passwordHash });
		return res.status(201).json({ id: user._id, name: user.name, email: user.email });
	} catch (err) {
		return res.status(500).json({ error: "Registration failed" });
	}
});

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ error: "Invalid credentials" });
		const ok = await user.validatePassword(password);
		if (!ok) return res.status(401).json({ error: "Invalid credentials" });
		const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "dev_secret", { expiresIn: "7d" });
		return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
	} catch (err) {
		return res.status(500).json({ error: "Login failed" });
	}
});

router.get("/me", requireAuth, async (req, res) => {
	const user = await User.findById(req.userId).select("name email");
	return res.json({ id: user._id, name: user.name, email: user.email });
});

export default router;

