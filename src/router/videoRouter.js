import express from "express";
import { home, postCreate } from "../controller/videoController";

const videoRouter = express.Router();

videoRouter.get("/", home);
videoRouter.post("/", postCreate);

export default videoRouter;
