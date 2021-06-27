import express from "express";
import {
  getDelete,
  getDetail,
  getUpload,
  postUpload,
} from "../controller/videoController";
import { loggedInUserOnly, uploadVideo } from "../middlewares";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(loggedInUserOnly)
  .get(getUpload)
  .post(uploadVideo.single("video"), postUpload);

videoRouter.get("/:id", getDetail);
videoRouter.get("/:id/delete", getDelete);

export default videoRouter;
