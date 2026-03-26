import { Link } from "react-router-dom";

export default function GcpMarketplace() {
  return (
    <main style={shellStyle}>
      <section style={heroStyle}>
        <div style={badgeStyle}>Google Cloud Marketplace</div>
        <h1 style={titleStyle}>DSG ONE Marketplace Entry</h1>
        <p style={leadStyle}>
          This page is the human-facing entry point for Google Cloud Marketplace onboarding,
          reviewer handoff, and product validation for DSG ONE.
        </p>
        <div style={buttonRowStyle}>
          <Link to="/marketplace-ui" style={primaryButtonStyle}>Open Reviewer Page</Link>
          <Link to="/login" style={secondaryButtonStyle}>Continue to Login</Link>
          <a href="/api/gcp/marketplace" style={secondaryButtonStyle}>Open Integration Endpoint</a>
        </div>
      </section>

      <section style={panelStyle}>
        <h2 style={headingStyle}>Marketplace Validation</h2>
        <ul style={listStyle}>
          <li>Human-facing Marketplace entry page for reviewer and onboarding flows.</li>
          <li>Dedicated login handoff route for product access.</li>
          <li>Machine-facing integration endpoint for Marketplace callback testing.</li>
          <li>Public health endpoint remains available at <code>/api/health</code>.</li>
        </ul>
      </section>
    </main>
  );
}

const shellStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#020617",
  color: "#e2e8f0",
  padding: "32px 20px 64px",
};

const heroStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "0 auto",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 28,
  padding: 28,
  background:
    "radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 30%), linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
  boxShadow: "0 20px 60px rgba(2,6,23,0.4)",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  padding: "8px 12px",
  borderRadius: 999,
  border: "1px solid rgba(52,211,153,0.35)",
  background: "rgba(16,185,129,0.1)",
  color: "#86efac",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const titleStyle: React.CSSProperties = {
  margin: "18px 0 0",
  fontSize: "clamp(40px, 7vw, 68px)",
  lineHeight: 0.98,
  letterSpacing: "-0.04em",
  color: "#f8fafc",
};

const leadStyle: React.CSSProperties = {
  maxWidth: 760,
  marginTop: 18,
  color: "#cbd5e1",
  fontSize: 18,
  lineHeight: 1.7,
};

const buttonRowStyle: React.CSSProperties = {
  display: "flex",
  gap: 14,
  flexWrap: "wrap",
  marginTop: 26,
};

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 16,
  fontWeight: 700,
  background: "linear-gradient(135deg, #10b981, #34d399)",
  color: "#052e16",
  textDecoration: "none",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 48,
  padding: "0 18px",
  borderRadius: 16,
  fontWeight: 700,
  border: "1px solid rgba(148,163,184,0.26)",
  background: "rgba(15,23,42,0.7)",
  color: "#e2e8f0",
  textDecoration: "none",
};

const panelStyle: React.CSSProperties = {
  maxWidth: 960,
  margin: "24px auto 0",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 24,
  padding: 24,
  background: "linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.96))",
};

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 30,
  color: "#f8fafc",
};

const listStyle: React.CSSProperties = {
  margin: "18px 0 0",
  paddingLeft: 20,
  color: "#cbd5e1",
  lineHeight: 1.8,
  fontSize: 17,
};
