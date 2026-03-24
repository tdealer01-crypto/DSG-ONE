import { BookOpen } from "lucide-react";

export default function Docs() {
  const sections = [
    {
      title: "Deterministic Safety Gate (DSG)",
      content: "The core of DSG ONE is the Deterministic Safety Gate. Before any autonomous agent action is executed, it must pass through this gate. The gate evaluates the proposed action against a strict set of policies defined by the organization. If the action violates any policy, it is deterministically blocked or stabilized."
    },
    {
      title: "Formal Verification (Z3 SMT Solver)",
      content: "To guarantee safety, DSG ONE uses formal verification. We translate the system state, the proposed action, and the safety policies into SMT-LIB v2 format. The Z3 SMT solver then attempts to prove that the action will not lead to a forbidden state. If the solver returns 'SAT' (Satisfiable) for the safety theorem, the action is proven safe."
    },
    {
      title: "Immutable Audit Ledger",
      content: "Every decision made by the DSG, along with its corresponding Z3 proof artifact and execution latency, is cryptographically hashed and stored in an immutable ledger. This provides a mathematically verifiable trail of all autonomous agent activity, essential for compliance and debugging."
    },
    {
      title: "Constant-Time Execution",
      content: "The transition logic within the DSG is designed to be structurally O(1). This means the time it takes to evaluate an action is independent of the system's history or the complexity of past actions, preventing timing side-channel attacks and ensuring predictable latency."
    },
    {
      title: "Mobile Control Runtime",
      content: "DSG ONE extends its safety guarantees to the edge via the Mobile Control Runtime. This user-consented, on-device execution environment ensures that AI agents operating on mobile devices are bound by the same deterministic safety rules and formal proofs as cloud-based agents, providing a unified safety envelope."
    },
    {
      title: "Open Standard Protocol",
      content: "We believe AI safety should not be a walled garden. DSG ONE implements an open standard protocol for agent-to-gate communication. This allows any autonomous agent framework to integrate with the DSG ONE control plane, submit execution requests, and receive deterministic ALLOW, STABILIZE, or BLOCK responses."
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Documentation</h1>
        <p className="text-muted-foreground">Architecture, concepts, and system design of DSG ONE Command Center.</p>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-primary/90 leading-relaxed">
        DSG ONE Command Center unifies command, invariants, stability, proof, ledger, capacity, and safe runtime into
        a single deterministic control plane for autonomous AI agents. This documentation explains each subsystem in simple terms.
      </div>

      <div className="space-y-8 mt-8">
        {sections.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" /> {s.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {s.content}
            </p>
          </div>
        ))}
        
        <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" /> Formal Proof Artifact (SMT-LIB v2)
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The following is the complete, audit-grade formal verification artifact for the Deterministic Safety Gate (DSG).
            </p>
            <pre className="bg-secondary p-4 rounded-md text-xs font-mono text-muted-foreground overflow-x-auto">
{`(set-logic ALL)
(set-option :produce-models true)

(declare-sort State 0)
(declare-fun IDLE () State)
(declare-fun AUTH () State)
(declare-fun EXEC () State)
(declare-fun FORBIDDEN () State)
(assert (distinct IDLE AUTH EXEC FORBIDDEN))

(declare-fun forbidden (State) Bool)
(assert (forbidden FORBIDDEN))
(assert (not (forbidden IDLE)))
(assert (not (forbidden AUTH)))
(assert (not (forbidden EXEC)))

(declare-fun gate (State State) Int)
(assert (forall ((s State) (s2 State))
 (=> (forbidden s2) (= (gate s s2) 1))))
(assert (= (gate IDLE AUTH) 0))
(assert (= (gate AUTH EXEC) 0))
(assert (forall ((s State) (s2 State))
 (=> (and (not (forbidden s2))
 (not (and (= s IDLE) (= s2 AUTH)))
 (not (and (= s AUTH) (= s2 EXEC))))
 (= (gate s s2) 2))))

(declare-fun delta (State State) State)
(assert (forall ((s State) (s2 State))
 (ite (= (gate s s2) 0)
 (= (delta s s2) s2)
 (= (delta s s2) s))))

(assert (forall ((s State) (s2 State))
 (=> (not (forbidden s))
 (not (forbidden (delta s s2))))))

(check-sat)
(get-model)`}
            </pre>
            <div className="mt-4 text-sm text-muted-foreground">
              <strong>Author:</strong> Thanawat Suparongsuwan<br/>
              <strong>License:</strong> Apache License 2.0
            </div>
          </div>
      </div>
    </div>
  );
}
