import { Link } from "react-router-dom";

const checks = [
  {
    title: "Product home",
    href: "/",
    description: "Open the DSG ONE control plane home surface.",
  },
  {
    title: "Marketplace entry",
    href: "/gcp-marketplace",
    description: "Open the human-facing Google Cloud Marketplace entry page.",
  },
  {
    title: "Health endpoint",
    href: "/api/health",
    description: "Verify that the runtime health endpoint returns a successful response.",
  },
];

export default function MarketplaceReviewer() {
  return (
    <main style={shellStyle}>
      <section style={heroStyle}>
        <div style={badgeStyle}>Marketplace Reviewer Page</div>
        <h1 style={titleStyle}>DSG — Deterministic Safety Gate</h1>
        <p style={leadStyle}>
          DSG ONE provides a deterministic AI control plane with execution governance,
          proof-aware replay, and Marketplace-facing onboarding surfaces.
        </p>
        <div style={buttonRowStyle}>
          <Link to="/" style={primaryButtonStyle}>Open Product Home</Link>
          <Link to="/gcp-marketplace" style={secondaryButtonStyle}>Open Marketplace Entry</Link>
          <a href="/api/health" style={secondaryButtonStyle}>Open Health Endpoint</a>
        </div>
      </section>

      <section style={gridStyle}>
        <article style={panelStyle}>
          <h2 style={headingStyle}>Review Summary</h2>
          <ul style={listStyle}>
            <li>Human-facing reviewer page for Google Cloud Marketplace validation.</li>
            <li>Dedicated Marketplace entry page for onboarding and reviewer handoff.</li>
            <li>Machine-facing integration endpoint for Marketplace callback validation.</li>
            <li>Public health endpoint for runtime verification.</li>
          </ul>
        </article>

        <article style={panelStyle}>
          <h2 style={headingStyle}>Reviewer Checks</h2>
          <div style={{ display: "grid", gap: 14 }}>
            {checks.map((item) => (
              <div key={item.title} style={cardStyle}>
                <div>
                  <h3 style={cardTitleStyle}>{item.title}</h3>
                  <p style={cardTextStyle}>{item.description}</p>
                </div>
                {item.href.startsWith("/api") ? (
                  <a href={item.href} style={linkStyle}>Open</a>
                ) : (
                  <Link to={item.href} style={linkStyle}>Open</Link>
                )}
              </div>
            ))}
          </div>
        </article>
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
  maxWidth: 1180,
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
  fontSize: "clamp(42px, 8vw, 72px)",
  lineHeight: 0.98,
  letterSpacing: "-0.04em",
  color: "#f8fafc",
};

const leadStyle: React.CSSProperties = {
  maxWidth: 780,
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

const gridStyle: React.CSSProperties = {
  maxWidth: 1180,
  margin: "24px auto 0",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 24,
};

const panelStyle: React.CSSProperties = {
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

const cardStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  alignItems: "center",
  padding: 18,
  borderRadius: 18,
  border: "1px solid rgba(148,163,184,0.16)",
  background: "rgba(15,23,42,0.75)",
};

const cardTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "#f8fafc",
  fontSize: 18,
};

const cardTextStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "#cbd5e1",
  lineHeight: 1.6,
};

const linkStyle: React.CSSProperties = {
  color: "#34d399",
  fontWeight: 700,
  textDecoration: "none",
  whiteSpace: "nowrap",
};
