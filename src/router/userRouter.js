import express from "express";
import {
  getCreateAccount,
  postCreateAccount,
  getLogin,
  postLogin,
  getLogout,
  ghStart,
  ghFinish,
} from "../controller/userController";

const userRouter = express.Router();

userRouter
  .route("/create-account")
  .get(getCreateAccount)
  .post(postCreateAccount);

userRouter.route("/login").get(getLogin).post(postLogin);

userRouter.get("/logout", getLogout);

userRouter.get("/github/start", ghStart);

userRouter.get("/github/finish", ghFinish);

export default userRouter;
