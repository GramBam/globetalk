import asyncHandler from "express-async-handler";
import Message from "../models/messageModel";
import Convo from "../models/convoModel";

export const createMessage = asyncHandler(async (req, res) => {
  const { convo_id, user_id, content } = req.query;
  try {
    const message = await Message.create({
      convo_id,
      author: user_id,
      content,
    });

    await Convo.findOneAndUpdate(
      {
        _id: convo_id,
      },
      {
        last_message: { content, read_by: [user_id] },
      }
    );
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

export const deleteAllMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find();
  for (let i = 0; i < messages.length; i++) {
    const element = messages[i];
    // @ts-ignore
    await Message.deleteOne(element);
    console.log(element, "deleted");
  }
});
