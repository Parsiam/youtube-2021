import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  social: { type: Boolean, required: true, default: false },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
  avatarURL: { type: String },
  videos: [{ type: mongoose.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.password !== "" && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
