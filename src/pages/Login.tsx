import { Link } from "react-router-dom";

export default function Login() {
  return (
    <main style={shellStyle}>
      <section style={cardStyle}>
        <div style={badgeStyle}>Login</div>
        <h1 style={titleStyle}>Access DSG ONE</h1>
        <p style={textStyle}>
          This is the stable login handoff page for Marketplace and direct product access.
          The next step is wiring this surface to the production authentication provider.
        </p>
        <div style={buttonColumnStyle}>
          <button style={primaryButtonStyle}>Continue with Email</button>
          <button style={secondaryButtonStyle}>Continue with SSO</button>
        </div>
        <div style={infoCardStyle}>
          <p style={{ margin: 0, color: "#f8fafc", fontWeight: 700 }}>Implementation note</p>
          <p style={{ margin: "10px 0 0", color: "#cbd5e1", lineHeight: 1.6 }}>
            Keep this route stable so onboarding and Marketplace flows can hand off here without changing URLs later.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
          <Link to="/gcp-marketplace" style={linkButtonStyle}>Marketplace Entry</Link>
          <Link to="/marketplace-ui" style={linkButtonStyle}>Reviewer Page</Link>
        </div>
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

const cardStyle: React.CSSProperties = {
  maxWidth: 680,
  margin: "0 auto",
  border: "1px solid rgba(148,163,184,0.18)",
  borderRadius: 28,
  padding: 28,
  background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(2,6,23,0.98))",
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
  fontSize: "clamp(36px, 7vw, 58px)",
  lineHeight: 1,
  letterSpacing: "-0.04em",
  color: "#f8fafc",
};

const textStyle: React.CSSProperties = {
  marginTop: 18,
  color: "#cbd5e1",
  fontSize: 18,
  lineHeight: 1.7,
};

const buttonColumnStyle: React.CSSProperties = {
  display: "grid",
  gap: 14,
  marginTop: 24,
};

const primaryButtonStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 16,
  border: 0,
  fontWeight: 700,
  background: "linear-gradient(135deg, #10b981, #34d399)",
  color: "#052e16",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  minHeight: 48,
  borderRadius: 16,
  border: "1px solid rgba(148,163,184,0.26)",
  fontWeight: 700,
  background: "rgba(15,23,42,0.7)",
  color: "#e2e8f0",
  cursor: "pointer",
};

const infoCardStyle: React.CSSProperties = {
  marginTop: 24,
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.16)",
  background: "rgba(15,23,42,0.75)",
};

const linkButtonStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: 44,
  padding: "0 16px",
  borderRadius: 14,
  border: "1px solid rgba(148,163,184,0.26)",
  background: "rgba(15,23,42,0.7)",
  color: "#e2e8f0",
  textDecoration: "none",
  fontWeight: 700,
};
