import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  createdAt: { type: Date, required: true, default: Date.now },
  text: { type: String, required: true, maxLength: 100 },
  owner: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
