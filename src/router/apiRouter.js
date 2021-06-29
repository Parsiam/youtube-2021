import express from "express";
import { addView } from "../controller/videoController";

const apiRouter = express.Router();

apiRouter.post("/video/:id/view", addView);

export default apiRouter;
