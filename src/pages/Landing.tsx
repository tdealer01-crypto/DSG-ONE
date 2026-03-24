import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, Activity, Lock, Zap, FileCheck, Server, BookOpen } from "lucide-react";

const pillars = [
  { title: "Deterministic Safety", desc: "Mathematical guarantees that agents never violate core policies.", icon: <Shield className="w-6 h-6 text-primary" /> },
  { title: "Formal Verification", desc: "Every decision is proven safe using Z3 SMT solvers before execution.", icon: <FileCheck className="w-6 h-6 text-primary" /> },
  { title: "Immutable Audit", desc: "Cryptographic ledger of all agent actions, reasoning, and proofs.", icon: <Lock className="w-6 h-6 text-primary" /> },
];

const steps = [
  { num: "01", title: "Intent Parsing", desc: "Agent proposes an action and its reasoning." },
  { num: "02", title: "Policy Check", desc: "Action is evaluated against deterministic safety gates." },
  { num: "03", title: "SMT Verification", desc: "Z3 solver proves the action maintains system invariants." },
  { num: "04", title: "Execution", desc: "Action is routed to the target environment." },
  { num: "05", title: "Ledger Commit", desc: "Proof and result are hashed and stored immutably." },
];

const trustItems = [
  "SOC2 Type II Certified",
  "HIPAA Compliant",
  "Zero-Trust Architecture",
  "End-to-End Encryption",
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
            D1
          </div>
          <span className="font-bold tracking-tight">DSG ONE</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#architecture" className="hover:text-foreground transition-colors">Architecture</a>
          <a href="#trust" className="hover:text-foreground transition-colors">Trust</a>
          <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
        </div>
        <div>
          <Link to="/app/monitor" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            Start Mission Control
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
            alt="Earth from space" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/80 to-background" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-8 border border-primary/20"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Deterministic AI Control Plane — Now in GA
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.1]"
          >
            Command Autonomous Agents with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
              Proof & Safety
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            DSG ONE Command Center is the mission control for autonomous AI agents.
            Deterministic safety gates, formal verification, immutable audit, and real-time governance — unified.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/app/monitor" className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              Start Mission Control <Activity size={18} />
            </Link>
            <Link to="/app/capacity" className="w-full sm:w-auto px-8 py-4 bg-secondary text-secondary-foreground rounded-md font-medium hover:bg-secondary/80 transition-colors">
              View Pricing
            </Link>
            <Link to="/docs" className="w-full sm:w-auto px-8 py-4 text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-2">
              Read Docs <BookOpen size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pillars */}
      <section id="features" className="py-24 px-6 bg-secondary/30 border-y border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Product Pillars</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Six integrated systems for commanding autonomous agents at scale.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pillars.map((p, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  {p.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture / How It Works */}
      <section id="architecture" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-6">Decision Pipeline</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every agent decision flows through five deterministic stages.
            </p>
            
            <div className="space-y-6">
              {steps.map((s, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-mono font-bold text-muted-foreground">
                    {s.num}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{s.title}</h4>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10">
              <Link to="/docs" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                See Full Architecture <Zap size={16} />
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-square rounded-2xl border border-border bg-card p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="relative z-10 font-mono text-sm text-muted-foreground space-y-4">
                <div>{`> agent.propose({ action: "deploy_update" })`}</div>
                <div className="text-warning">{`[WARN] Checking policy constraints...`}</div>
                <div className="text-success">{`[OK] Policy check passed.`}</div>
                <div className="text-primary">{`[INFO] Generating SMT-LIB v2 proof...`}</div>
                <div className="text-success">{`[OK] Z3 Solver: SAT (Safe)`}</div>
                <div>{`> system.execute(action)`}</div>
                <div className="text-muted-foreground/50">{`[HASH] 0x8f4a...e21b committed to ledger.`}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section id="trust" className="py-24 px-6 bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-12">Built for Trust</h2>
          
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 font-medium text-lg opacity-90">
                <Shield className="w-6 h-6" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to take command?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Deploy deterministic safety for your autonomous agents in minutes.
          </p>
          <Link to="/app/monitor" className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors text-lg">
            Start Mission Control <Zap size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          © 2026 DSG ONE Command Center. All rights reserved.
        </div>
        <div className="flex gap-6">
          <Link to="/docs" className="hover:text-foreground transition-colors">Docs</Link>
          <Link to="/app/capacity" className="hover:text-foreground transition-colors">Pricing</Link>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success" /> Status: Operational
          </span>
        </div>
      </footer>
    </div>
  );
}
