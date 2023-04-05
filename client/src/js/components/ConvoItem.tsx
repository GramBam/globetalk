import { GetConvoResponse } from "../api/ConvosApi";
import { User } from "../redux/reducers/authReducer";
import { getTimeSince } from "../utils/getTimeSince";

interface ConvoItemProps {
  convo: GetConvoResponse;
  currentConvo: GetConvoResponse;
  setCurrentConvo: React.Dispatch<
    React.SetStateAction<GetConvoResponse | undefined>
  >;
  user: User;
}

function ConvoItem({
  convo,
  currentConvo,
  setCurrentConvo,
  user,
}: ConvoItemProps) {
  const getMessageDate = (ts: string) => {
    const timeSince = getTimeSince(ts);
    return timeSince === "Just Now" ? timeSince : timeSince + " ago";
  };
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
          convo.members.find((member) => member.email !== user.email)?.avatar
        }
      />
      <div className="chat-info">
        <div className="contact-name">
          {
            convo.members.find((member) => member.email !== user.email)
              ?.username
          }{" "}
        </div>
        <div className="last-message">
          {!!convo.latest_message && convo.latest_message.content}
        </div>
      </div>
      <div className="chat-status">
        <div className="chat-date">
          {!!convo.latest_message &&
            getMessageDate(convo.latest_message.createdAt as string)}
        </div>
      </div>
    </div>
  );
}
export default ConvoItem;
