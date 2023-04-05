import { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ConvosApi, GetConvoResponse } from "../api/ConvosApi";
import { User } from "../redux/reducers/authReducer";
import ConvoItem from "./ConvoItem";
import NewConvoModal from "./modals/NewConvoModal";

function Conversations({
  currentConvo,
  setCurrentConvo,
  convos,
  setConvos,
  user,
}: {
  currentConvo: GetConvoResponse;
  setCurrentConvo: React.Dispatch<
    React.SetStateAction<GetConvoResponse | undefined>
  >;
  convos: GetConvoResponse[];
  setConvos: React.Dispatch<React.SetStateAction<GetConvoResponse[]>>;
  user: User;
}) {
  const [newConvoError, setNewConvoError] = useState<string>("");
  const [showConvoModal, setShowConvoModal] = useState<boolean>(false);

  const openNewConvo = async (identifier: string) => {
    try {
      const newConvo = await ConvosApi.createConvo(user._id, identifier);
      setShowConvoModal(false);
      setConvos((prev) => [newConvo, ...prev]);
      setCurrentConvo(newConvo);
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
                <Link to={`/messages/${convo._id}`}>
                  <ConvoItem
                    convo={convo}
                    currentConvo={currentConvo}
                    setCurrentConvo={setCurrentConvo}
                    user={user}
                  />
                </Link>
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
