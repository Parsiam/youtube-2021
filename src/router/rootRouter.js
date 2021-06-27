import express from "express";
import { home } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);

export default rootRouter;
