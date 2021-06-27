import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  social: { type: Boolean, required: true, default: false },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String },
});

userSchema.pre("save", async function () {
  if (this.password !== "") {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const User = mongoose.model("User", userSchema);

export default User;
