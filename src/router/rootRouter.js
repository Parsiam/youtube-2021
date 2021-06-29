import express from "express";
import { home, getSearch } from "../controller/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.get("/search", getSearch);

export default rootRouter;
