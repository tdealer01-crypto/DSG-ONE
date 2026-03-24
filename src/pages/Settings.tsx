import { Save } from "lucide-react";

export default function Settings() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your DSG ONE account and organization preferences.</p>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
              <input type="text" defaultValue="Operator" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
              <input type="email" defaultValue="admin@dsg.one" disabled className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-md text-muted-foreground cursor-not-allowed" />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-semibold mb-4">Organization</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Organization Name</label>
              <input type="text" defaultValue="DSG Corp" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Default Policy</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>strict-read-only</option>
                <option>audit-only</option>
                <option>allow-all (Not Recommended)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
