import asyncHandler from "express-async-handler";
import Message from "../models/messageModel";

export const createMessage = asyncHandler(async (req, res) => {
  const { convo_id, user_id, content } = req.query;
  try {
    const message = await Message.create({
      convo_id,
      author: user_id,
      content,
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json(500);
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  const { convo_id } = req.query;

  try {
    const messages = await Message.find({
      convo_id,
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json(error);
  }
});

const deleteAllMessages = asyncHandler(async (req, res) => {
  // const messages = await Message.find();
  // for (let i = 0; i < messages.length; i++) {
  //   const element = messages[i];
  //   await Message.deleteOne(element);
  //   console.log(element, "deleted");
  // }
});
