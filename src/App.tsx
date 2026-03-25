import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Proofs from "./pages/Proofs";
import Executions from "./pages/Executions";

export default function App() {
return (
<BrowserRouter>
<div style={{ padding: 20 }}>
<h1>DSG ONE</h1>

    <nav style={{ display: "flex", gap: 12 }}>
      <Link to="/proofs">Proofs</Link>
      <Link to="/replay">Replay</Link>
    </nav>

    <div style={{ marginTop: 20 }}>
      <Routes>
        <Route path="/proofs" element={<Proofs />} />
        <Route path="/replay" element={<Executions />} />
        <Route path="*" element={<div>Route not found</div>} />
      </Routes>
    </div>
  </div>
</BrowserRouter>

);
}
