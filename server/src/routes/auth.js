import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// ===============================
// POST /api/auth/login
// ===============================
router.post("/login", async (req, res) => {
	const { email, password } = req.body;

	// 1️⃣ Basic validation
	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required." });
	}

	try {
		// 2️⃣ Find the user by email (include password field)
		const user = await User.findOne({ email }).select("+password");

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password." });
		}

		// 3️⃣ Compare password with hashed password in DB
		const isValid = await bcrypt.compare(password, user.password || user.passwordHash);

		if (!isValid) {
			return res.status(401).json({ error: "Invalid email or password." });
		}

		// 4️⃣ Create a JWT payload
		const payload = {
			id: user._id,
			userId: user._id, // support both formats
			email: user.email,
			name: user.name || "",
		};

		// 5️⃣ Sign JWT token (valid for 7 days)
		const token = signToken(payload, { expiresIn: "7d" });

		// 6️⃣ Return token and user info to client
		res.json({
			success: true,
			message: "Login successful",
			token,
			user: {
				id: user._id,
				email: user.email,
				name: user.name || "",
			},
		});
	} catch (err) {
		console.error("Login error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// ===============================
// POST /api/auth/register
// ===============================
router.post("/register", async (req, res) => {
	const { email, password, name } = req.body;

	if (!email || !password) {
		return res.status(400).json({ error: "Email and password are required." });
	}

	try {
		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ error: "User already exists." });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = await User.create({ email, password: hashedPassword, name });

		res.status(201).json({
			success: true,
			message: "User registered",
			user: {
				id: newUser._id,
				email: newUser.email,
				name: newUser.name || "",
			},
		});
	} catch (err) {
		console.error("Register error:", err);
		res.status(500).json({ error: "Server error" });
	}
});

// ===============================
// GET /api/auth/me
// ===============================
router.get("/me", requireAuth, async (req, res) => {
	try {
		const user = await User.findById(req.userId || req.user?.id).select("name email");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		return res.json({
			id: user._id,
			name: user.name,
			email: user.email,
		});
	} catch (err) {
		console.error("Get me error:", err);
		return res.status(500).json({ error: "Server error" });
	}
});

export default router;

