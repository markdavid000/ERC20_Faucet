export interface ContractStats {
  maxSupply: string;
  totalSupply: string;
  claimAmount: string;
  cooldown: number;
  name: string;
  symbol: string;
  decimals: number;
}

export interface UserStats {
  balance: string;
  lastClaimed: number;
  nextClaimAt: number;
  canClaim: boolean;
  cooldownRemaining: number;
}

export interface StatusLogEntry {
  id: string;
  type: "claimed" | "minted" | "transfer" | "refill";
  address?: string;
  amount?: string;
  timestamp: number;
  txHash?: string;
}

export interface TransactionState {
  loading: boolean;
  error: string | null;
  txHash: string | null;
  success: boolean;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  txHash?: string;
  duration?: number;
}
