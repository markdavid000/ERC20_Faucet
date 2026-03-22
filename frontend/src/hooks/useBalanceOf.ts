import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { useContract } from "./useContract";
import { formatTokenAmount } from "../lib/utils";

export function useBalanceOf() {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { readContract } = useContract();

  const fetchBalance = useCallback(async (address: string) => {
    if (!ethers.isAddress(address)) {
      setError("Invalid address");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const raw = await readContract.balanceOf(address);
      setBalance(formatTokenAmount(raw as bigint));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
      console.error("[useBalanceOf]", msg);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { balance, loading, error, fetchBalance };
}
