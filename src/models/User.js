import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { s3 } from "../middlewares";

const defaultURL =
  "https://res.cloudinary.com/betula/image/upload/v1623148866/gsrslupcr0ue7n6llm3n.png";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  social: { type: Boolean, required: true, default: false },
  userName: { type: String, required: true, default: "user", maxLength: 20 },
  password: { type: String },
  avatarURL: {
    type: String,
    default: defaultURL,
  },
  videos: [{ type: mongoose.Types.ObjectId, ref: "Video" }],
});

userSchema.pre("save", async function (next) {
  if (this.password !== "" && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.static("deletePrevAvatar", function (url) {
  if (url !== defaultURL) {
    const fileName = url.split("com/")[1];

    s3.deleteObject(
      {
        Bucket: "metube-2021-upload",
        Key: fileName,
      },
      (err, data) => {
        if (err) {
          throw err;
        }
      }
    );
  }
});

const User = mongoose.model("User", userSchema);

export default User;
