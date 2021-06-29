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
  .post(
    uploadVideo.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    postUpload
  );

videoRouter.get("/:id", getDetail);
videoRouter.get("/:id/delete", loggedInUserOnly, getDelete);

export default videoRouter;
