import asyncHandler from "express-async-handler";
import * as jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response } from "express";

const protect = asyncHandler(async (req: Request, res: Response, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret);

      // @ts-ignore
      req.user = await User.findById((decoded as jwt.JwtPayload).id).select(
        "-password"
      );

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not Authorized");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Authorized");
  }
});

export default protect;
