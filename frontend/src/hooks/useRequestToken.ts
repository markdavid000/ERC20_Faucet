import { useState, useCallback } from "react";
import type { TransactionState } from "../types";
import { useApp } from "../context/AppContext";
import { useContract } from "./useContract";
import { BLOCK_EXPLORER } from "../config/contract";

export function useRequestToken() {
  const [state, setState] = useState<TransactionState>({
    loading: false,
    error: null,
    txHash: null,
    success: false,
  });

  const { addToast, addLogEntry, setUserStats, address } = useApp();
  const { getWriteContract } = useContract();

  const requestToken = useCallback(async () => {
    setState({ loading: true, error: null, txHash: null, success: false });

    try {
      const contract = await getWriteContract();
      if (!contract) throw new Error("No signer available");
      const tx = await contract.requestToken();
      addToast({
        type: "info",
        title: "Transaction submitted",
        message: "Waiting for confirmation…",
        txHash: tx.hash,
      });
      const receipt = await tx.wait();
      setState({
        loading: false,
        error: null,
        txHash: receipt.hash,
        success: true,
      });

      addLogEntry({
        type: "claimed",
        address: address ?? undefined,
        amount: "100",
        timestamp: Math.floor(Date.now() / 1000),
        txHash: receipt.hash,
      });

      // Update user stats with new cooldown
      // const now = Math.floor(Date.now() / 1000);
      // setUserStats({
      //   balance: "350.00", // stub
      //   lastClaimed: now,
      //   nextClaimAt: now + 86400,
      //   canClaim: false,
      //   cooldownRemaining: 86400,
      // });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setState({
        loading: false,
        error: message,
        txHash: null,
        success: false,
      });
      addToast({ type: "error", title: "Claim Failed", message });
    }
  }, [getWriteContract, addToast, addLogEntry, setUserStats, address]);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, txHash: null, success: false });
  }, []);

  return { ...state, requestToken, reset, explorerUrl: BLOCK_EXPLORER };
}
