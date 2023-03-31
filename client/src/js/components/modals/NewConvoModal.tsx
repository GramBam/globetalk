import { useState } from "react";
import IconButton from "../common/IconButton";

function NewConvoModal({
  onClose,
  onSubmit,
  newConvoError,
}: {
  onClose: () => void;
  onSubmit: (input: string) => void;
  newConvoError: string;
}) {
  const [userInput, setUserInput] = useState<string>("");
  return (
    <div className="new-convo-modal">
      <IconButton
        icon="MdCancel"
        size={25}
        color="#333333"
        className="close-modal"
        clickCallback={onClose}
      />
      <h3>New Conversation</h3>
      <p>Username or Email:</p>
      <input
        value={userInput}
        onChange={(e) => {
          setUserInput(e.target.value);
        }}
      ></input>
      {newConvoError && <p>{newConvoError}</p>}
      <button onClick={() => onSubmit(userInput)}>Go</button>
    </div>
  );
}
export default NewConvoModal;
