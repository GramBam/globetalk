import express from "express";
import {
  createMessage,
  deleteAllMessages,
  getMessages,
} from "../controllers/messageController";

const messageRouter = express.Router();

messageRouter.get("/", getMessages);
messageRouter.post("/", createMessage);
// messageRouter.delete("/", deleteAllMessages);

export default messageRouter;
