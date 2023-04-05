import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ConvosApi, GetConvoResponse } from "../api/ConvosApi";
import { GetMessagesResponse } from "../api/MessagesAPI";
import Chat from "../components/Chat";
import Conversations from "../components/Conversations";
import { RootState } from "../redux/store";
import { isMobileDevice } from "../utils/isMobile";
import socket from "../utils/socket";

function Messages() {
  const { convo_id } = useParams();

  const { user } = useSelector((state: RootState) => state.auth);
  const [currentConvo, setCurrentConvo] = useState<GetConvoResponse | null>(
    null
  );
  const [convos, setConvos] = useState<Array<GetConvoResponse>>([]);
  const [convosLoading, setConvosLoading] = useState<boolean>(false);

  const isMobile = isMobileDevice();

  const showConvos = (isMobile && !currentConvo) || !isMobile;

  useEffect(() => {
    socket.emit("addUser", user._id);
  }, [user._id]);

  useEffect(() => {
    setConvosLoading(true);
    const getConvos = async () => {
      const response = await ConvosApi.getConvos(user._id);
      setConvos(response);

      const isCurrentConvo = response.find((convo) => convo._id === convo_id);

      if (isCurrentConvo) {
        setCurrentConvo(isCurrentConvo);
      }
      setConvosLoading(false);
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
      {showConvos && (
        <Conversations
          convos={convos}
          setConvos={setConvos}
          currentConvo={currentConvo as GetConvoResponse}
          setCurrentConvo={setCurrentConvo}
          user={user}
        />
      )}
      {currentConvo ? (
        <Chat
          currentConvo={currentConvo}
          updateConvo={updateConvo}
          resetConvo={() => setCurrentConvo(null)}
          user={user}
        />
      ) : (
        !convosLoading &&
        !isMobile && (
          <div className="no-convo-message">
            <h2>Select a chat or start a new conversation</h2>
          </div>
        )
      )}
    </div>
  );
}
export default Messages;
