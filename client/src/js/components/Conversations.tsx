import axios, { AxiosError } from "axios";
import { useState } from "react";
import { ConvoResponse } from "../pages/Messages";
import { User } from "../redux/reducers/authReducer";
import { getTimeSince } from "../utils/getTimeSince";
import NewConvoModal from "./modals/NewConvoModal";

function Conversations({
  currentConvo,
  setCurrentConvo,
  convos,
  setConvos,
  user,
}: {
  currentConvo: ConvoResponse | undefined;
  setCurrentConvo: React.Dispatch<
    React.SetStateAction<ConvoResponse | undefined>
  >;
  convos: ConvoResponse[];
  setConvos: React.Dispatch<React.SetStateAction<ConvoResponse[]>>;
  user: User;
}) {
  const [newConvoError, setNewConvoError] = useState<string>("");
  const [showConvoModal, setShowConvoModal] = useState<boolean>(false);

  const getMessageDate = (ts: string) => {
    const timeSince = getTimeSince(ts);
    return timeSince === "Just Now" ? timeSince : timeSince + " ago";
  };

  const openNewConvo = async (identifier: string) => {
    try {
      await axios({
        method: "POST",
        url: "/api/convo/",
        params: {
          user1_id: user._id,
          user2_id: identifier,
        },
      }).then((res) => {
        setShowConvoModal(false);
        setConvos((prev) => [res.data, ...prev]);
        setCurrentConvo(res.data);
      });
    } catch (error) {
      setNewConvoError((error as AxiosError).response?.data as string);
    }
  };

  return (
    <>
      <div className="conversations">
        <div className="nav">
          <p className="title">All conversations</p>
          <button className="new-convo" onClick={() => setShowConvoModal(true)}>
            New Conversation
          </button>
        </div>

        <div className="contacts">
          {!!convos.length &&
            convos.map((convo) => {
              return (
                <div
                  className={`contact ${
                    convo._id === currentConvo?._id && "selected-contact"
                  }`}
                  key={convo._id}
                  onClick={() => {
                    setCurrentConvo(convo);
                  }}
                >
                  <img
                    className="chat-avatar"
                    alt="Friend Avatar"
                    src={
                      convo.members.find(
                        (member) => member.email !== user.email
                      )?.avatar
                    }
                  />
                  <div className="chat-info">
                    <div className="contact-name">
                      {
                        convo.members.find(
                          (member) => member.email !== user.email
                        )?.username
                      }{" "}
                    </div>
                    <div className="last-message">
                      {!!convo.latest_message && convo.latest_message.content}
                    </div>
                  </div>
                  <div className="chat-status">
                    <div className="chat-date">
                      {!!convo.latest_message &&
                        getMessageDate(
                          convo.latest_message.createdAt as string
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {showConvoModal && (
        <NewConvoModal
          newConvoError={newConvoError}
          onClose={() => {
            setShowConvoModal(false);
            setNewConvoError("");
          }}
          onSubmit={openNewConvo}
        />
      )}
    </>
  );
}
export default Conversations;
