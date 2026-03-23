import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import type {
  ContractStats,
  UserStats,
  StatusLogEntry,
  ToastMessage,
} from "../types";
import { generateId } from "../lib/utils";

const LOG_STORAGE_KEY = "marktoken_status_log";
const LOG_MAX_PERSIST = 50; // keep up to 50 entries in storage

function loadLog(): StatusLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StatusLogEntry[];
  } catch {
    return [];
  }
}

function saveLog(log: StatusLogEntry[]) {
  try {
    localStorage.setItem(
      LOG_STORAGE_KEY,
      JSON.stringify(log.slice(0, LOG_MAX_PERSIST))
    );
  } catch {
    // storage quota exceeded — silently ignore
  }
}

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface AppContextValue {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  chainId: number | null;

  contractStats: ContractStats | null;
  statsLoading: boolean;
  refreshStats: () => Promise<void>;

  userStats: UserStats | null;
  userStatsLoading: boolean;
  refreshUserStats: () => Promise<void>;

  statusLog: StatusLogEntry[];
  addLogEntry: (entry: Omit<StatusLogEntry, "id">) => void;

  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;

  cooldownSeconds: number;

  setAddress: (addr: string | null) => void;
  setIsConnected: (v: boolean) => void;
  setIsConnecting: (v: boolean) => void;
  setChainId: (id: number | null) => void;
  setContractStats: (s: ContractStats | null) => void;
  setStatsLoading: (v: boolean) => void;
  setUserStats: (s: UserStats | null) => void;
  setUserStatsLoading: (v: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

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

  const [statusLog, setStatusLog] = useState<StatusLogEntry[]>(() => loadLog());

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (userStats && userStats.cooldownRemaining > 0) {
      setCooldownSeconds(userStats.cooldownRemaining);
      timerRef.current = setInterval(() => {
        setCooldownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
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

  const addLogEntry = useCallback((entry: Omit<StatusLogEntry, "id">) => {
    setStatusLog((prev) => {
      const next = [
        { ...entry, id: generateId() },
        ...prev.slice(0, LOG_MAX_PERSIST - 1),
      ];
      saveLog(next);
      return next;
    });
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, "id">) => {
    const id = generateId();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration ?? 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const refreshStats = useCallback(async () => {}, []);
  const refreshUserStats = useCallback(async () => {}, []);

  const { address: appKitAddress, isConnected: appKitConnected } =
    useAppKitAccount();
  const toastedAddressRef = useRef<string | null>(null);

  useEffect(() => {
    if (appKitConnected && appKitAddress) {
      if (toastedAddressRef.current === appKitAddress) return;
      toastedAddressRef.current = appKitAddress;
      addToast({
        type: "success",
        title: "Wallet Connected",
        message: `${appKitAddress.slice(0, 6)}\u2026${appKitAddress.slice(-4)}`,
        duration: 3000,
      });
    } else if (!appKitConnected) {
      toastedAddressRef.current = null;
    }
  }, [appKitConnected, appKitAddress, addToast]);

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

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
