import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

function Home() {
  const { user } = useSelector((state: RootState) => state.auth);

  return <div>{(user && user.username) || "home"}</div>;
}
export default Home;
