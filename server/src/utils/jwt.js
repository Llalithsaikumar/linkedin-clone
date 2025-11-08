// server/src/utils/jwt.js
import jwt from "jsonwebtoken";

function getSecret() {
	const secret = process.env.JWT_SECRET;
	if (!secret) {
		console.warn("Warning: JWT_SECRET is not set.");
		throw new Error("JWT_SECRET must be set in environment variables");
	}
	return secret;
}

export function signToken(payload, opts = {}) {
	const signOptions = { expiresIn: opts.expiresIn || "7d" };
	const secret = getSecret();
	return jwt.sign(payload, secret, signOptions);
}

export function verifyToken(token) {
	try {
		const secret = getSecret();
		return jwt.verify(token, secret);
	} catch (err) {
		return null;
	}
}

