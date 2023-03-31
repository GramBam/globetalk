import { useState } from "react";
import {
  MdDarkMode,
  MdHelp,
  MdHome,
  MdLogin,
  MdLogout,
  MdMail,
  MdMessage,
  MdPeople,
  MdPerson,
  MdPersonAdd,
  MdSettings,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/reducers/authReducer";
import { RootState } from "../../redux/store";
import { isMobileDevice } from "../../utils/isMobile";
import IconButton from "../common/IconButton";
import SidePanelSection from "./SidePanelSection";

export type SectionItems = {
  name: string;
  icon: JSX.Element;
  callback?: () => void;
}[];

function SidePanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.auth);

  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>("");

  const MENU_ITEMS: SectionItems = [
    {
      name: "Home",
      icon: <MdHome />,
      callback: () => {
        navigate("/");
      },
    },
    {
      name: "Solo",
      callback: () => {
        user && navigate("/solo");
      },
      icon: <MdPerson />,
    },
    {
      name: "Chatroom",
      icon: <MdPeople />,
      callback: () => {
        user && navigate("/");
      },
    },
    {
      name: "Messages",
      icon: <MdMessage />,
      callback: () => {
        user && navigate("/messages");
      },
    },
  ];

  const SUPPORT_ITEMS: SectionItems = [
    {
      name: "About",
      icon: <MdHelp />,
      callback: () => {
        navigate("/about");
      },
    },
    {
      name: "Contact",
      icon: <MdMail />,
      callback: () => {
        navigate("/contact");
      },
    },
  ];

  const SETTINGS_ITEMS: SectionItems = user
    ? [
        { name: "Dark Mode", icon: <MdDarkMode /> },
        { name: "Account", icon: <MdSettings /> },
        {
          name: "Log Out",
          icon: <MdLogout />,
          callback: () => {
            dispatch(logout());
            navigate("/");
          },
        },
      ]
    : [
        { name: "Dark Mode", icon: <MdDarkMode /> },
        {
          name: "Log in",
          icon: <MdLogin />,
          callback: () => {
            navigate("/login");
          },
        },
        {
          name: "Register",
          icon: <MdPersonAdd />,
          callback: () => {
            navigate("/register");
          },
        },
      ];

  return (
    <>
      {isMobileDevice() && collapsed ? (
        <div className="menu-btn">
          <IconButton
            icon="MdMenu"
            size={30}
            clickCallback={() => setCollapsed(false)}
          />
        </div>
      ) : (
        <div className="side-panel">
          <div className="panel-nav">
            {isMobileDevice() && (
              <IconButton
                icon="MdClose"
                size={30}
                color="#FFFFFF"
                clickCallback={() => setCollapsed(true)}
              />
            )}

            <Link to="/">
              <div className="title">GlobeTalk</div>
            </Link>
          </div>

          {user && (
            <div className="user-section">
              <img
                className="user-avatar"
                src={
                  user && user.avatar
                    ? user.avatar
                    : `https://robohash.org/${Math.random()}`
                }
                alt="user-avatar"
              />
              <div className="user-info">
                <p className="user-name">{user.username}</p>
                <p className="user-email">{user.email}</p>
              </div>
            </div>
          )}
          <div className="panel-sections">
            <SidePanelSection
              title="MENU"
              items={MENU_ITEMS}
              selected={selected}
              setSelected={setSelected}
              setCollapsed={setCollapsed}
            />
            <SidePanelSection
              title="SUPPORT"
              items={SUPPORT_ITEMS}
              selected={selected}
              setSelected={setSelected}
              setCollapsed={setCollapsed}
            />
            <SidePanelSection
              title="SETTINGS"
              items={SETTINGS_ITEMS}
              selected={selected}
              setSelected={setSelected}
              setCollapsed={setCollapsed}
            />
          </div>
          <div className="panel-footer">
            Made with <span className="heart">&#10084;</span> by Graham Moss
          </div>
        </div>
      )}
    </>
  );
}
export default SidePanel;
