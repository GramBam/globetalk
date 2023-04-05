import axios from "axios";

export type GetMessagesResponse = {
  author: string;
  convo_id: string;
  content: string;
  _id?: string;
  createdAt?: string;
};

const url = "/api/message/";

const createMessage = async (
  convo_id: string,
  user_id: string,
  content: string
): Promise<GetMessagesResponse> => {
  const params = { convo_id, user_id, content };
  return await axios
    .post(url, null, { params })
    .then((response) => response.data);
};

const getMessages = async (
  convo_id: string
): Promise<GetMessagesResponse[]> => {
  const params = { convo_id };
  return await axios.get(url, { params }).then((response) => response.data);
};

export const MessagesApi = {
  createMessage,
  getMessages,
};
