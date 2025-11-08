import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		password: { type: String, required: true, select: false }, // exclude password by default
		passwordHash: { type: String } // legacy support
	},
	{ timestamps: true }
);

// Helper method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
	const pwd = this.password || this.passwordHash;
	return bcrypt.compare(enteredPassword, pwd);
};

// Legacy method support
userSchema.methods.validatePassword = async function (password) {
	const pwd = this.password || this.passwordHash;
	return bcrypt.compare(password, pwd);
};

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const User = mongoose.model("User", userSchema);
export default User;

