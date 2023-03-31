import { cloneElement, MouseEvent } from "react";
import {
  MdCancel,
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdFileCopy,
  MdMic,
  MdMicOff,
  MdPause,
  MdRecordVoiceOver,
  MdSend,
  MdSettings,
  MdShare,
  MdStop,
  MdSwapHoriz,
  MdSwapVert,
} from "react-icons/md";

const iconMap = {
  MdSettings: <MdSettings />,
  MdSwapHoriz: <MdSwapHoriz />,
  MdSwapVert: <MdSwapVert />,
  MdRecordVoiceOver: <MdRecordVoiceOver />,
  MdSend: <MdSend />,
  MdMic: <MdMic />,
  MdMicOff: <MdMicOff />,
  MdPause: <MdPause />,
  MdStop: <MdStop />,
  MdFileCopy: <MdFileCopy />,
  MdShare: <MdShare />,
  MdClose: <MdClose />,
  MdCancel: <MdCancel />,
  MdChevronRight: <MdChevronRight />,
  MdChevronLeft: <MdChevronLeft />,
};

export type IconName = keyof typeof iconMap;

interface IconButtonProps {
  icon: IconName;
  size: number;
  className?: string;
  color?: string;
  clickCallback?: (e?: MouseEvent<HTMLButtonElement>) => void;
}

function IconButton({
  icon,
  size,
  className = "",
  color = "#333",
  clickCallback,
}: IconButtonProps) {
  return (
    <button className={`icon-button ${className}`} onClick={clickCallback}>
      {cloneElement(iconMap[icon], { color, size })}
    </button>
  );
}
export default IconButton;
