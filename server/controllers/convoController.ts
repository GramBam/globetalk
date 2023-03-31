import User from "../models/userModel";
import Convo from "../models/convoModel";
import Message from "../models/messageModel";
import asyncHandler from "express-async-handler";

// @ts-ignore
export const createConvo = asyncHandler(async (req, res) => {
  const { user1_id, user2_id } = req.query;
  const user1 = await User.findById(user1_id);

  if (!user1) {
    return res.status(400).send("Error");
  }

  let user2;

  if ((user2_id as string).includes("@")) {
    user2 = await User.findOne({ email: user2_id });
  } else {
    user2 = await User.findOne({ username: user2_id });
  }

  if (!user2) {
    return res.status(400).send("No user by that email or username");
  }

  let existingConvo = await Convo.find({
    "members.id": {
      $all: [user1._id, user2._id],
    },
  });

  if (existingConvo.length) {
    return res.status(400).send("A Conversation with this user already exists");
  }

  const user1Obj = {
    username: user1.username,
    email: user1.email,
    id: user1._id,
    avatar: user1.avatar,
  };
  const user2Obj = {
    username: user2.username,
    email: user2.email,
    id: user2._id,
    avatar: user2.avatar,
  };

  try {
    const newConvo = await Convo.create({ members: [user1Obj, user2Obj] });
    res.status(200).json(newConvo);
  } catch (error) {
    res.status(500).json(error);
  }
});

export const getConvos = asyncHandler(async (req, res) => {
  const { userID } = req.query;

  console.log("HELLO");

  try {
    const userConvos = await Convo.find({
      members: { $elemMatch: { id: userID } },
    }).sort({ createdAt: -1 });

    const convos = [];

    for (let i = 0; i < userConvos.length; i++) {
      const el = userConvos[i];
      const latestMessage = await Message.find({
        convo_id: el._id,
      })
        .limit(1)
        .sort({ $natural: -1 });
      convos[i] = {
        _id: el._id,
        members: el.members,
        latest_message: latestMessage[0],
      };
    }

    res.status(200).json(convos);
  } catch (error) {
    res.status(500).json(error);
  }
});
