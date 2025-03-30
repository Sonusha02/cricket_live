import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LiveMatches from "./pages/LiveMatches";
import BetHistory from "./pages/BetHistory";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LiveMatches />} />
        <Route path="/bets" element={<BetHistory />} />
      </Routes>
    </Router>
  );
}

export default App;
