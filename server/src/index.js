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

// ----- add near the top, after your imports -----
process.on("uncaughtException", (err) => {
	console.error("UNCAUGHT EXCEPTION:", err && (err.stack || err.message || err));
	// don't exit — allow Railway to show logs
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("UNHANDLED REJECTION at:", promise, "reason:", reason && (reason.stack || reason));
	// don't exit — allow Railway to show logs
});
// ------------------------------------------------

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

// Replace your existing start() with this safe startup routine
async function start() {
	try {
		console.log("STARTUP: process.env.PORT =", process.env.PORT, "  fallback port =", port);
		console.log("STARTUP: using mongoUri =", (mongoUri || "").slice(0, 40) + "..."); // partial for safety

		// Try connecting to MongoDB, but allow server to start even if DB is down
		try {
			await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
			console.log("Connected to MongoDB");
		} catch (dbErr) {
			console.error("MongoDB connection failed (will continue and start server):", dbErr && (dbErr.stack || dbErr.message || dbErr));
			// do not process.exit(1);
		}

		// Start the HTTP server regardless of DB status
		const listener = app.listen(port, () => {
			const actualPort = listener.address && listener.address().port;
			console.log(`Server listening on port ${actualPort} (process.env.PORT=${process.env.PORT})`);
		});

		// optional: graceful shutdown hooks
		const shutdown = async (signal) => {
			console.log(`Received ${signal}. Shutting down gracefully...`);
			try {
				await mongoose.disconnect();
			} catch (e) {
				/* ignore */
			}
			process.exit(0);
		};
		process.on("SIGINT", () => shutdown("SIGINT"));
		process.on("SIGTERM", () => shutdown("SIGTERM"));
	} catch (err) {
		// Catch any fatal startup error and log it (do NOT crash silently)
		console.error("Fatal startup error:", err && (err.stack || err.message || err));
		// Leave process running for debugging — do not call process.exit here
	}
}

start();

