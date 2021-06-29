import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  social: { type: Boolean, required: true, default: false },
  userName: { type: String, required: true, default: "user" },
  password: { type: String },
  avatarURL: {
    type: String,
    default:
      "https://res.cloudinary.com/betula/image/upload/v1623148866/gsrslupcr0ue7n6llm3n.png",
  },
  videos: [{ type: mongoose.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function () {
  if (this.password !== "" && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
