import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AgentProvider } from "./context/AgentContext";
import OperatorConsole from "./components/OperatorConsole";
import Proofs from "./pages/Proofs";
import Executions from "./pages/Executions";
import Fleet from "./pages/Fleet";
import MarketplaceReviewer from "./pages/MarketplaceReviewer";
import GcpMarketplace from "./pages/GcpMarketplace";
import Login from "./pages/Login";

const navLinkStyle: React.CSSProperties = {
  color: "#cbd5e1",
  textDecoration: "none",
  fontWeight: 600,
};

export default function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0", padding: 20 }}>
          <div
            style={{
              maxWidth: 1180,
              margin: "0 auto",
              border: "1px solid rgba(148,163,184,0.14)",
              borderRadius: 22,
              padding: 20,
              background: "rgba(15,23,42,0.86)",
            }}
          >
            <h1 style={{ margin: 0, color: "#f8fafc" }}>DSG ONE</h1>

            <nav style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 14 }}>
              <Link to="/" style={navLinkStyle}>Fleet</Link>
              <Link to="/proofs" style={navLinkStyle}>Proofs</Link>
              <Link to="/replay" style={navLinkStyle}>Replay</Link>
              <Link to="/marketplace-ui" style={navLinkStyle}>Reviewer</Link>
              <Link to="/gcp-marketplace" style={navLinkStyle}>Marketplace</Link>
              <Link to="/login" style={navLinkStyle}>Login</Link>
            </nav>
          </div>

          <div style={{ marginTop: 20 }}>
            <Routes>
              <Route path="/" element={<Fleet />} />
              <Route path="/proofs" element={<Proofs />} />
              <Route path="/replay" element={<Executions />} />
              <Route path="/marketplace-ui" element={<MarketplaceReviewer />} />
              <Route path="/gcp-marketplace" element={<GcpMarketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<div style={{ padding: 20 }}>Route not found</div>} />
            </Routes>
          </div>
        </div>
        <OperatorConsole />
      </BrowserRouter>
    </AgentProvider>
  );
}
