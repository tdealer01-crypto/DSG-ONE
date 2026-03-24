import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Shield, LayoutDashboard, Server, Activity, 
  FileCheck, History, CreditCard, BookOpen, Settings, Menu, X, LogOut, User,
  Target, ShieldAlert, Zap
} from "lucide-react";
import { auth, loginWithGoogle, logout } from "../firebase";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

const navItems = [
  { label: "Mission Control", path: "/app/monitor", icon: <LayoutDashboard size={18} /> },
  { label: "Fleet", path: "/app/fleet", icon: <Server size={18} /> },
  { label: "Operations", path: "/app/operations", icon: <Activity size={18} /> },
  { label: "Invariants", path: "/app/invariants", icon: <Target size={18} /> },
  { label: "Stability", path: "/app/stability", icon: <ShieldAlert size={18} /> },
  { label: "Ledger", path: "/app/ledger", icon: <History size={18} /> },
  { label: "Proofs", path: "/app/proofs", icon: <FileCheck size={18} /> },
  { label: "Capacity", path: "/app/capacity", icon: <CreditCard size={18} /> },
  { label: "Settings", path: "/app/settings", icon: <Settings size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              D1
            </div>
            <div>
              <div className="font-bold text-sm tracking-tight">DSG ONE</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Command Center</div>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.icon}
                {item.label}
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-border">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground">
                {user.photoURL ? <img src={user.photoURL} alt="Avatar" className="w-full h-full rounded-full" referrerPolicy="no-referrer" /> : <User size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.displayName || 'Operator'}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
              <button onClick={logout} className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors" title="Logout">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={loginWithGoogle}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10">
          <button 
            className="p-2 -ml-2 lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">System Nominal</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-4">
            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-1 rounded">v2.4.1-stable</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
