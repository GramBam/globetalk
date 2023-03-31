import express from "express";
import { createConvo, getConvos } from "../controllers/convoController";

const convoRouter = express.Router();

convoRouter.get("/", getConvos);
convoRouter.post("/", createConvo);

export default convoRouter;
