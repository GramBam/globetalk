import { Express } from "express";
import convoRouter from "../routes/convoRoutes";
import messageRouter from "../routes/messageRoutes";
import userRouter from "../routes/userRoutes";

export const useRoutes = (app: Express) => {
  app.use("/api/users", userRouter);
  app.use("/api/convo", convoRouter);
  app.use("/api/message", messageRouter);
};
