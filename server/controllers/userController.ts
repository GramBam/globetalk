import bcrypt from "bcryptjs";
import { Request } from "express";
import asyncHandler from "express-async-handler";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/userModel";

export interface GetUserRequest extends Request {
  user?: {
    _id: string;
    email: string;
    username: string;
  };
}

// @route /api/users/register
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please include all fields");
  }

  // Find if user already exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const avatar = `https://robohash.org/${Math.random()}`;

  // Create user
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    avatar,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id.toString()),
      avatar,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @route /api/users/login
export const loginUser = asyncHandler(async (req: GetUserRequest, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check user and password match
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id as unknown as string),
    });
  } else {
    res.status(401);
    throw new Error("Invalid login");
  }
});

export const getMe = asyncHandler(async (req: GetUserRequest, res) => {
  const user = {
    id: req.user?._id,
    email: req.user?.email,
    username: req.user?.username,
  };
  res.status(200).json(user);
});

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: "30d",
  });
};
