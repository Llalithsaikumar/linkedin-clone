import { verifyToken } from "../utils/jwt.js";

export function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization || "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

	if (!token) {
		return res.status(401).json({ error: "Missing token" });
	}

	const payload = verifyToken(token);

	if (!payload) {
		return res.status(401).json({ error: "Invalid token" });
	}

	// Support both userId and id from payload
	req.userId = payload.userId || payload.id;
	req.user = payload; // Attach full user payload
	next();
}

