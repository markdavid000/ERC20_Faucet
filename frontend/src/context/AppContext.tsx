import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import type {
  ContractStats,
  UserStats,
  StatusLogEntry,
  ToastMessage,
} from "../types";
import { generateId } from "../lib/utils";

interface AppContextValue {
  // Wallet
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;

  // Contract stats (read)
  contractStats: ContractStats | null;
  statsLoading: boolean;
  refreshStats: () => Promise<void>;

  // User stats (read)
  userStats: UserStats | null;
  userStatsLoading: boolean;
  refreshUserStats: () => Promise<void>;

  // Status log
  statusLog: StatusLogEntry[];
  addLogEntry: (entry: Omit<StatusLogEntry, "id">) => void;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;

  // Cooldown timer (per-user, live countdown)
  cooldownSeconds: number;

  // Setters for wallet state (called from wallet hooks)
  setAddress: (addr: string | null) => void;
  setIsConnected: (v: boolean) => void;
  setIsConnecting: (v: boolean) => void;
  setChainId: (id: number | null) => void;
  setContractStats: (s: ContractStats | null) => void;
  setStatsLoading: (v: boolean) => void;
  setUserStats: (s: UserStats | null) => void;
  setUserStatsLoading: (v: boolean) => void;
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────
const AppContext = createContext<AppContextValue | null>(null);

// ─────────────────────────────────────────────
// Mock initial log entries for demo display
// ─────────────────────────────────────────────
const INITIAL_LOG: StatusLogEntry[] = [];

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<number | null>(null);

  const [contractStats, setContractStats] = useState<ContractStats | null>(
    null
  );
  const [statsLoading, setStatsLoading] = useState(false);

  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userStatsLoading, setUserStatsLoading] = useState(false);

  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>(INITIAL_LOG);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Live countdown for the current user
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Cooldown ticker ──────────────────────────
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (userStats && userStats.cooldownRemaining > 0) {
      setCooldownSeconds(userStats.cooldownRemaining);
      timerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCooldownSeconds(0);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userStats]);

  // ── Log ─────────────────────────────────────
  const addLogEntry = useCallback((entry: Omit<StatusLogEntry, "id">) => {
    setStatusLog((prev) => [
      { ...entry, id: generateId() },
      ...prev.slice(0, 19),
    ]);
  }, []);

  // ── Toasts ──────────────────────────────────
  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = generateId();
    setToasts((prev) => [...prev, { ...toast, id }]);
    const duration = toast.duration ?? 5000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Stub refresh functions (implemented in hooks) ──
  const refreshStats = useCallback(async () => {}, []);
  const refreshUserStats = useCallback(async () => {}, []);

  const value: AppContextValue = {
    address,
    isConnected,
    isConnecting,
    chainId,
    contractStats,
    statsLoading,
    refreshStats,
    userStats,
    userStatsLoading,
    refreshUserStats,
    statusLog,
    addLogEntry,
    toasts,
    addToast,
    removeToast,
    cooldownSeconds,
    setAddress,
    setIsConnected,
    setIsConnecting,
    setChainId,
    setContractStats,
    setStatsLoading,
    setUserStats,
    setUserStatsLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
