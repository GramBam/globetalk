import express from "express";
import { createMessage, getMessages } from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/", getMessages);
messageRouter.post("/", createMessage);

export default messageRouter;
