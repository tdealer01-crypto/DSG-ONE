import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AgentProvider } from "./context/AgentContext";
import OperatorConsole from "./components/OperatorConsole";
import Proofs from "./pages/Proofs";
import Executions from "./pages/Executions";
import Fleet from "./pages/Fleet";
import Ledger from "./pages/Ledger";

export default function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <div style={{ padding: 20 }}>
          <h1>DSG ONE</h1>

          <nav style={{ display: "flex", gap: 12 }}>
            <Link to="/">Fleet</Link>
            <Link to="/proofs">Proofs</Link>
            <Link to="/replay">Replay</Link>
            <Link to="/ledger">Ledger</Link>
          </nav>

          <div style={{ marginTop: 20 }}>
            <Routes>
              <Route path="/" element={<Fleet />} />
              <Route path="/proofs" element={<Proofs />} />
              <Route path="/replay" element={<Executions />} />
              <Route path="/ledger" element={<Ledger />} />
              <Route path="*" element={<div>Route not found</div>} />
            </Routes>
          </div>
        </div>
        <OperatorConsole />
      </BrowserRouter>
    </AgentProvider>
  );
}
