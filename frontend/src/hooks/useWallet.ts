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
    addToast,
  } = useApp();

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

  useEffect(() => {
    setChainId(appKitChainId ? Number(appKitChainId) : null);
  }, [appKitChainId, setChainId]);

  useEffect(() => {
    if (appKitConnected && appKitAddress) {
      addToast({
        type: "success",
        title: "Wallet Connected",
        message: `${appKitAddress.slice(0, 6)}…${appKitAddress.slice(-4)}`,
      });
    }
  }, [appKitConnected]);

  const connect = useCallback(() => {
    open();
  }, [open]);

  const disconnect = useCallback(async () => {
    // const { disconnect: appKitDisconnect } = await import(
    //   "@reown/appkit/react"
    // );

    open({ view: "Account" });
  }, [open]);

  return {
    address,
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };
}
