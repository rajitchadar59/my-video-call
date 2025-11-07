import { AuthProvider } from "./context/AuthContext";
import Authentication from "./pages/Authentication";
import Landing from "./pages/landing";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/Home";
import History from "./pages/History";

function App() {

  return (
    <>
      <Router>
        <AuthProvider>

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Authentication />} />
            <Route path="/home" element={<Home />} />
            <Route path="/history" element={<History />} />
            <Route path="/:url" element={<VideoMeet />} />
          </Routes>

        </AuthProvider>
      </Router>
    </>
  );
}

export default App;
