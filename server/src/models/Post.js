import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true }
	},
	{ timestamps: true, _id: true }
);

const postSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		text: { type: String, required: true, trim: true },
		imageUrl: { type: String },
		likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		comments: [commentSchema]
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;

