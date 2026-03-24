/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import MissionControl from "./pages/MissionControl";
import Fleet from "./pages/Fleet";
import Executions from "./pages/Executions";
import Proofs from "./pages/Proofs";
import Ledger from "./pages/Ledger";
import Billing from "./pages/Billing";
import Docs from "./pages/Docs";
import Settings from "./pages/Settings";
import Invariants from "./pages/Invariants";
import Stability from "./pages/Stability";
import Chatbot from "./components/Chatbot";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public Trust Layer */}
          <Route path="/" element={<Landing />} />
          <Route path="/docs" element={<Docs />} />
          
          {/* Command Layer */}
          <Route path="/app" element={<Navigate to="/app/monitor" replace />} />
          <Route path="/app/*" element={
            <Layout>
              <Routes>
                <Route path="monitor" element={<MissionControl />} />
                <Route path="fleet" element={<Fleet />} />
                <Route path="operations" element={<Executions />} />
                <Route path="invariants" element={<Invariants />} />
                <Route path="stability" element={<Stability />} />
                <Route path="ledger" element={<Ledger />} />
                <Route path="proofs" element={<Proofs />} />
                <Route path="capacity" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        <Chatbot />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
