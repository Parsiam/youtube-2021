import express from "express";
import {
  getDelete,
  getDetail,
  getUpload,
  postUpload,
} from "../controller/videoController";
import { loggedInUserOnly } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(loggedInUserOnly)
  .get(getUpload)
  .post(postUpload);

videoRouter.get("/:id", getDetail);

videoRouter.get("/:id/delete", loggedInUserOnly, getDelete);

export default videoRouter;
