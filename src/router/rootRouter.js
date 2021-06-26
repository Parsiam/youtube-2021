import express from "express";
import {
  getLogin,
  postLogin,
  getCreateAccount,
  postCreateAccount,
  getLogout,
} from "../controller/userController";
import { home } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);

rootRouter.route("/login").get(getLogin).post(postLogin);

rootRouter.get("/logout", getLogout);

rootRouter
  .route("/create-account")
  .get(getCreateAccount)
  .post(postCreateAccount);

export default rootRouter;
