import { useState, useCallback } from "react";
import { ethers } from "ethers";
import type { TransactionState } from "../types";
import { useApp } from "../context/AppContext";
import { useContract } from "./useContract";
import { BLOCK_EXPLORER } from "../config/contract";

export function useMintMTK() {
  const [state, setState] = useState<TransactionState>({
    loading: false,
    error: null,
    txHash: null,
    success: false,
  });

  const { addToast, addLogEntry } = useApp();
  const { getWriteContract } = useContract();

  const mint = useCallback(
    async (recipient: string, amount: string) => {
      if (!recipient || !amount) {
        addToast({
          type: "error",
          title: "Invalid input",
          message: "Address and amount required.",
        });
        return;
      }
      if (!ethers.isAddress(recipient)) {
        addToast({
          type: "error",
          title: "Invalid address",
          message: "Please enter a valid Ethereum address.",
        });
        return;
      }
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        addToast({
          type: "error",
          title: "Invalid amount",
          message: "Amount must be greater than 0.",
        });
        return;
      }

      setState({ loading: true, error: null, txHash: null, success: false });

      try {
        const contract = await getWriteContract();
        if (!contract) throw new Error("No signer available");
        const amountWei = ethers.parseUnits(amount, 18);
        const tx = await contract.mint(recipient, amountWei);
        addToast({
          type: "info",
          title: "Minting…",
          message: "Waiting for confirmation.",
          txHash: tx.hash,
        });
        const receipt = await tx.wait();
        setState({
          loading: false,
          error: null,
          txHash: receipt.hash,
          success: true,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setState({
          loading: false,
          error: message,
          txHash: null,
          success: false,
        });
        addToast({ type: "error", title: "Mint Failed", message });
      }
    },
    [getWriteContract, addToast, addLogEntry]
  );

  const reset = useCallback(() => {
    setState({ loading: false, error: null, txHash: null, success: false });
  }, []);

  return { ...state, mint, reset, explorerUrl: BLOCK_EXPLORER };
}
