import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Chat from "../components/Chat";
import Conversations from "../components/Conversations";
import { RootState } from "../redux/store";
import socket from "../utils/socket";

export type ConvoMember = {
  username: string;
  email: string;
  id: string;
  avatar: string;
};

export type ConvoResponse = {
  members: ConvoMember[];
  latest_message: GetMessagesResponse;
  _id: string;
};

export type GetMessagesResponse = {
  author: string;
  convo_id: string;
  content: string;
  _id?: string;
  createdAt?: string;
};

function Messages() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentConvo, setCurrentConvo] = useState<ConvoResponse>();
  const [convos, setConvos] = useState<Array<ConvoResponse>>([]);

  useEffect(() => {
    socket.emit("addUser", user._id);
  }, [user._id]);

  useEffect(() => {
    const getConvos = async () => {
      await axios({
        method: "GET",
        url: "/api/convo/",
        params: {
          userID: user._id,
        },
      }).then((res: { data: ConvoResponse[] }) => {
        setConvos(res.data);
        if (!currentConvo && res.data[0]) {
          setCurrentConvo(res.data[0]);
        }
      });
    };

    getConvos();
  }, []);

  const updateConvo = (latest_message: GetMessagesResponse) => {
    let updatedConvos = convos.map((convo) => {
      if (convo._id === latest_message.convo_id) {
        return { ...convo, latest_message };
      }
      return convo;
    });

    setConvos(updatedConvos as ConvoResponse[]);
  };

  return (
    <div className="messages-page">
      <Conversations
        convos={convos}
        setConvos={setConvos}
        currentConvo={currentConvo}
        setCurrentConvo={setCurrentConvo}
        user={user}
      />
      {currentConvo && (
        <Chat
          currentConvo={currentConvo}
          updateConvo={updateConvo}
          user={user}
        />
      )}
    </div>
  );
}
export default Messages;
