import { useEffect, useCallback } from "react";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useApp } from "../context/AppContext";

export function useWallet() {
  const { open } = useAppKit();
  const {
    address: appKitAddress,
    isConnected: appKitConnected,
    status,
  } = useAppKitAccount();
  const { chainId: appKitChainId } = useAppKitNetwork();

  const {
    address,
    isConnected,
    isConnecting,
    setAddress,
    setIsConnected,
    setIsConnecting,
    setChainId,
  } = useApp();

  // Sync account state into context
  useEffect(() => {
    setAddress(appKitAddress ?? null);
    setIsConnected(appKitConnected);
    setIsConnecting(status === "connecting" || status === "reconnecting");
  }, [
    appKitAddress,
    appKitConnected,
    status,
    setAddress,
    setIsConnected,
    setIsConnecting,
  ]);

  // Sync chain
  useEffect(() => {
    setChainId(appKitChainId ? Number(appKitChainId) : null);
  }, [appKitChainId, setChainId]);

  const connect = useCallback(() => {
    open();
  }, [open]);
  const disconnect = useCallback(() => {
    open({ view: "Account" });
  }, [open]);

  return { address, isConnected, isConnecting, connect, disconnect };
}
