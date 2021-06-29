import express from "express";
import { addComment, addView } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id/view", addView);
apiRouter.post("/video/:id/comment", addComment);

export default apiRouter;
