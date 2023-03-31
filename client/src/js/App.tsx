import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SidePanel from "./components/SidePanel/SidePanel";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <div className="App">
        <SidePanel />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
