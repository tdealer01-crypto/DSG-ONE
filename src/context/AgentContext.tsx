import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';

export type AgentState = 'IDLE' | 'LISTENING' | 'THINKING' | 'PROPOSING' | 'VALIDATING' | 'WAITING_APPROVAL' | 'EXECUTING' | 'SPEAKING';

export interface Proposal {
  id: string;
  toolName: string;
  args: any;
  decision?: 'ALLOW' | 'STABILIZE' | 'BLOCK';
  reason?: string;
}

export interface LedgerEntry {
  id: string;
  timestamp: string;
  goal: string;
  proposal?: Proposal;
  tool?: string;
  decision?: 'ALLOW' | 'STABILIZE' | 'BLOCK';
  reason?: string;
  result?: any;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED';
  auditId: string;
  proofRef: string;
}

interface AgentContextType {
  state: AgentState;
  setState: (state: AgentState) => void;
  currentGoal: string;
  setCurrentGoal: (goal: string) => void;
  activeProposal: Proposal | null;
  setActiveProposal: (proposal: Proposal | null) => void;
  ledger: LedgerEntry[];
  addLedgerEntry: (entry: LedgerEntry) => void;
  updateLedgerEntry: (id: string, updates: Partial<LedgerEntry>) => void;
  approveProposal: () => void;
  rejectProposal: () => void;
  pendingApprovalCallback: React.MutableRefObject<((approved: boolean) => void) | null>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AgentState>('IDLE');
  const [currentGoal, setCurrentGoal] = useState('');
  const [activeProposal, setActiveProposal] = useState<Proposal | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const pendingApprovalCallback = useRef<((approved: boolean) => void) | null>(null);

  const addLedgerEntry = (entry: LedgerEntry) => {
    setLedger(prev => [entry, ...prev]);
  };

  const updateLedgerEntry = (id: string, updates: Partial<LedgerEntry>) => {
    setLedger(prev => prev.map(entry => entry.id === id ? { ...entry, ...updates } : entry));
  };

  const approveProposal = () => {
    if (pendingApprovalCallback.current) {
      pendingApprovalCallback.current(true);
      pendingApprovalCallback.current = null;
    }
  };

  const rejectProposal = () => {
    if (pendingApprovalCallback.current) {
      pendingApprovalCallback.current(false);
      pendingApprovalCallback.current = null;
    }
  };

  return (
    <AgentContext.Provider value={{
      state, setState,
      currentGoal, setCurrentGoal,
      activeProposal, setActiveProposal,
      ledger, addLedgerEntry, updateLedgerEntry,
      approveProposal, rejectProposal,
      pendingApprovalCallback
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const context = useContext(AgentContext);
  if (context === undefined) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}
