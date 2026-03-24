import { CreditCard, Check } from "lucide-react";

export default function Billing() {
  const plans = [
    { name: "Starter", price: "$49", desc: "For small teams and side projects.", execs: "5,000", agents: "5", proofs: "Standard", support: "Community", current: false },
    { name: "Pro", price: "$249", desc: "For growing autonomous fleets.", execs: "25,000", agents: "25", proofs: "Priority", support: "Email", current: true },
    { name: "Enterprise", price: "Custom", desc: "For mission-critical deployments.", execs: "Unlimited", agents: "Unlimited", proofs: "Dedicated", support: "24/7 Phone", current: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Billing & Capacity</h1>
        <p className="text-muted-foreground">Current plan, usage, and capacity management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Current Plan</h3>
          <div className="text-3xl font-bold tracking-tight mb-1">Pro</div>
          <div className="text-sm text-muted-foreground">$249/month · billed monthly</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Executions Used</h3>
          <div className="text-3xl font-bold tracking-tight mb-1">8,412</div>
          <div className="text-sm text-muted-foreground mb-4">of 25,000 included</div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: "33%" }} />
          </div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Overage</h3>
          <div className="text-3xl font-bold tracking-tight mb-1">$0.00</div>
          <div className="text-sm text-muted-foreground">$0.002 per additional execution</div>
        </div>
        
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Projected End-of-Month</h3>
          <div className="text-3xl font-bold tracking-tight mb-1">~18,200</div>
          <div className="text-sm text-success">Within plan capacity</div>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Plan Comparison</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div key={i} className={`bg-card border rounded-xl p-6 flex flex-col ${plan.current ? "border-primary shadow-lg shadow-primary/5" : "border-border"}`}>
              {plan.current && <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Current Plan</div>}
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold tracking-tight">{plan.price}</span>
                {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
              </div>
              <p className="text-sm text-muted-foreground mb-6 h-10">{plan.desc}</p>
              
              <div className="space-y-3 flex-1 mb-8">
                {[
                  `${plan.execs} executions`,
                  `${plan.agents} agents`,
                  `${plan.proofs} proofs`,
                  `${plan.support} support`,
                  "Immutable audit ledger",
                  "Real-time dashboard",
                ].map((f, j) => (
                  <div key={j} className="flex items-center gap-3 text-sm">
                    <Check size={16} className="text-primary shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              
              <button className={`w-full py-2.5 rounded-md text-sm font-medium transition-colors ${
                plan.current 
                  ? "bg-secondary text-secondary-foreground cursor-default" 
                  : plan.price === "Custom" 
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80" 
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
              }`}>
                {plan.current ? "Current Plan" : plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
