import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";
import { ConvoResponse, GetMessagesResponse } from "../pages/Messages";
import socket from "../utils/socket";
import LoadingDisplay from "./common/LoadingDisplay";
import { User } from "../redux/reducers/authReducer";

function Chat({
  currentConvo,
  updateConvo,
  user,
}: {
  currentConvo: ConvoResponse;
  updateConvo: (data: GetMessagesResponse) => void;
  user: User;
}) {
  const [messages, setMessages] = useState<Array<GetMessagesResponse>>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const lastMessage = useRef<HTMLDivElement>(null);
  const convoRef = useRef<ConvoResponse>(currentConvo);

  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  }, [messages]);

  const setSocketCallback = () => {
    socket.on("getMessage", (data: GetMessagesResponse) => {
      console.log("RECIEVED:", data, convoRef.current);
      updateConvo(data);
      if (data.convo_id === convoRef.current._id) {
        setMessages((prev) => [...prev, data]);
      }
    });
  };

  useEffect(() => {
    setSocketCallback();
  }, []);

  useEffect(() => {
    convoRef.current = currentConvo;
  }, [currentConvo]);

  const submitMessage = () => {
    if (!currentConvo || !userInput) {
      return;
    }

    const convo_id = currentConvo._id;
    const user_id = user._id;

    socket.emit("sendMessage", {
      convo_id,
      user_id,
      otherUser_id: currentConvo.members.find(
        (member) => member.id !== user._id
      )?.id,
      message: userInput,
    });
    setMessages((prev) => [
      ...prev,
      { author: user_id, content: userInput, convo_id },
    ]);
    axios({
      method: "POST",
      url: "/api/message/",
      params: {
        convo_id,
        user_id,
        content: userInput,
      },
    }).then((res: { data: GetMessagesResponse }) => {
      updateConvo(res.data);
      setUserInput("");
    });
  };

  useEffect(() => {
    setMessagesLoading(true);
    const getMessages = async () => {
      await axios({
        method: "GET",
        url: "/api/message/",
        params: {
          convo_id: currentConvo?._id,
        },
      }).then((res) => {
        setMessages(res.data);
        setMessagesLoading(false);
      });
    };
    getMessages();
  }, [currentConvo]);

  return (
    <div className="chat-container">
      <div className="chat-header"></div>
      <div className="contact-messages">
        {messagesLoading ? (
          <div className="loading-container">
            <LoadingDisplay />
          </div>
        ) : messages.length ? (
          messages.map((message, i) => (
            <p
              className={`direct-message ${
                message.author === user._id ? "sent" : "recieved"
              }`}
              key={message._id + i.toString()}
              ref={i === messages.length - 1 ? lastMessage : null}
            >
              <Linkify>{message.content}</Linkify>
            </p>
          ))
        ) : (
          <p>No messages yet</p>
        )}
      </div>
      <div
        className="chat-input-container"
        onKeyDown={(e) => {
          e.key === "Enter" && submitMessage();
        }}
      >
        <input
          className="chat-input"
          value={userInput}
          onChange={(e) => {
            setUserInput(e.target.value);
          }}
          type="text"
          placeholder="Write a message..."
        ></input>
      </div>
    </div>
  );
}
export default Chat;
