import express from "express";
import {
  getCreateAccount,
  postCreateAccount,
  getLogin,
  postLogin,
  getLogout,
  ghStart,
  ghFinish,
  userProfile,
  getMe,
  postME,
} from "../controller/userController";
import { uploadImg } from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/create-account")
  .get(getCreateAccount)
  .post(postCreateAccount);

userRouter.route("/login").get(getLogin).post(postLogin);

userRouter.get("/logout", getLogout);

userRouter.get("/github/start", ghStart);

userRouter.get("/github/finish", ghFinish);

userRouter.route("/me").get(getMe).post(uploadImg.single("avatar"), postME);

userRouter.get("/:id", userProfile);

export default userRouter;
