import express from "express";
import {
  addComment,
  addView,
  deleteComment,
} from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id/view", addView);
apiRouter.post("/video/:id/comment", addComment);
apiRouter.delete("/video/:id/comment/:commentId", deleteComment);

export default apiRouter;
