import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ConvosApi, GetConvoResponse } from "../api/ConvosApi";
import { GetMessagesResponse } from "../api/MessagesAPI";
import Chat from "../components/Chat";
import Conversations from "../components/Conversations";
import { RootState } from "../redux/store";
import { isMobileDevice } from "../utils/isMobile";
import socket from "../utils/socket";

function Messages() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [currentConvo, setCurrentConvo] = useState<GetConvoResponse>();
  const [convos, setConvos] = useState<Array<GetConvoResponse>>([]);

  const isMobile = isMobileDevice();

  useEffect(() => {
    socket.emit("addUser", user._id);
  }, [user._id]);

  useEffect(() => {
    const getConvos = async () => {
      const response = await ConvosApi.getConvos(user._id);
      setConvos(response);
      if (!currentConvo && response[0] && !isMobile) {
        setCurrentConvo(response[0]);
      }
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

    setConvos(updatedConvos as GetConvoResponse[]);
  };

  return (
    <div className="messages-page">
      <Conversations
        convos={convos}
        setConvos={setConvos}
        currentConvo={currentConvo as GetConvoResponse}
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
