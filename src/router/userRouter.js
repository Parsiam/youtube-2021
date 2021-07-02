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
import {
  errorHandleUploadImg,
  loggedInUserOnly,
  publicOnly,
  uploadImg,
} from "../middlewares";

const userRouter = express.Router();

userRouter
  .route("/create-account")
  .all(publicOnly)
  .get(getCreateAccount)
  .post(postCreateAccount);

userRouter.route("/login").all(publicOnly).get(getLogin).post(postLogin);

userRouter.get("/logout", loggedInUserOnly, getLogout);

userRouter.get("/github/start", publicOnly, ghStart);

userRouter.get("/github/finish", publicOnly, ghFinish);

userRouter.route("/me").all(loggedInUserOnly).get(getMe).post(postME);

userRouter.get("/:id", userProfile);

export default userRouter;
