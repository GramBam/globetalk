import axios from "axios";
import { GetMessagesResponse } from "./MessagesApi";

export type ConvoMember = {
  username: string;
  email: string;
  id: string;
  avatar: string;
};

export type GetConvoResponse = {
  members: ConvoMember[];
  latest_message: GetMessagesResponse;
  _id: string;
};

const url = "/api/convo/";

const createConvo = async (user1_id: string, user2_id: string) => {
  const params = { user1_id, user2_id };

  return await axios
    .post(url, null, { params })
    .then((response) => response.data);
};

const getConvos = async (userID: string): Promise<GetConvoResponse[]> => {
  const params = { userID };
  return await axios.get(url, { params }).then((response) => response.data);
};

export const ConvosApi = {
  createConvo,
  getConvos,
};
