import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import usersRouter from "./routes/users.js";
import { requireAuth } from "./middleware/auth.js";
import path from "path";
import multer from "multer";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from server root directory
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

const port = process.env.PORT || 4000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/linkedin_clone";
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Fast server patch (temporary, safe) — strip unexpected prefix
app.use((req, res, next) => {
	// remove accidental prefix (example: /way.app)
	if (req.url.startsWith("/way.app")) {
		req.url = req.url.replace("/way.app", "") || "/";
	}
	next();
});

// Static uploads
const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/uploads", express.static(uploadsDir));

// Multer setup for simple image upload to disk
const storage = multer.diskStorage({
	destination: function (req, file, cb) { cb(null, uploadsDir); },
	filename: function (req, file, cb) {
		const ext = file.originalname.includes(".") ? file.originalname.substring(file.originalname.lastIndexOf(".")) : "";
		cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`);
	}
});
const upload = multer({ storage });

app.get("/health", (req, res) => {
	res.json({ ok: true });
});

app.get("/api/health", (req, res) => {
	res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/users", usersRouter);

app.post("/api/upload", requireAuth, upload.single("image"), (req, res) => {
	if (!req.file) return res.status(400).json({ error: "No file" });
	return res.status(201).json({ url: `/uploads/${req.file.filename}` });
});

async function start() {
	try {
		console.log("STARTUP: process.env.PORT=", process.env.PORT, "using fallback port", port);
		// try connecting but do NOT kill the process on failure so the app can respond
		await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
		console.log("Connected to MongoDB");
	} catch (error) {
		// log full error but continue to start server so Railway won't return 502
		console.error("MongoDB connection failed (will continue):", error && (error.stack || error.message || error));
		// Optionally set a flag here to show DB is down; do NOT process.exit(1)
	}

	// Start HTTP server regardless of DB status
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
}

start();

