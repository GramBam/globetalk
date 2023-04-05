import { useEffect, useRef, useState } from "react";
import Linkify from "react-linkify";
import socket from "../utils/socket";
import LoadingDisplay from "./common/LoadingDisplay";
import { User } from "../redux/reducers/authReducer";
import { GetMessagesResponse, MessagesApi } from "../api/MessagesAPI";
import { GetConvoResponse } from "../api/ConvosApi";

function Chat({
  currentConvo,
  updateConvo,
  user,
}: {
  currentConvo: GetConvoResponse;
  updateConvo: (data: GetMessagesResponse) => void;
  user: User;
}) {
  const [messages, setMessages] = useState<Array<GetMessagesResponse>>([]);
  const [messagesLoading, setMessagesLoading] = useState<boolean>(false);
  const lastMessage = useRef<HTMLDivElement>(null);
  const convoRef = useRef<GetConvoResponse>(currentConvo);

  const [userInput, setUserInput] = useState<string>("");

  useEffect(() => {
    if (lastMessage.current) {
      lastMessage.current.scrollIntoView();
    }
  }, [messages]);

  const setSocketCallback = () => {
    socket.on("getMessage", (data: GetMessagesResponse) => {
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

  const submitMessage = async () => {
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

    const newMessage: GetMessagesResponse = await MessagesApi.createMessage(
      convo_id,
      user_id,
      userInput
    );

    console.log(newMessage);

    updateConvo(newMessage);
    setUserInput("");
  };

  useEffect(() => {
    setMessagesLoading(true);

    const getMessages = async () => {
      const currentMessages: GetMessagesResponse[] =
        await MessagesApi.getMessages(currentConvo._id);
      console.log(currentMessages);
      setMessages(currentMessages);
      setMessagesLoading(false);
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
