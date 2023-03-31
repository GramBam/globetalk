import express from "express";
import protect from "../middleware/authMiddleware";
import { registerUser, loginUser, getMe } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", protect, getMe);

export default userRouter;
