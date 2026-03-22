import { useMemo, useRef } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contract";
import { useAppKitProvider } from "@reown/appkit/react";

const RPC_URL = "https://lisk-sepolia.drpc.org";
const _readProvider = new ethers.JsonRpcProvider(RPC_URL);
const _readContract = new ethers.Contract(
  CONTRACT_ADDRESS,
  CONTRACT_ABI as unknown as string[],
  _readProvider
);

export function useContract() {
  const { walletProvider } =
    useAppKitProvider<ethers.Eip1193Provider>("eip155");
  const walletProviderRef = useRef(walletProvider);
  walletProviderRef.current = walletProvider;

  const getWriteContract = useMemo(
    () => async (): Promise<ethers.Contract | null> => {
      const provider = walletProviderRef.current;
      if (!provider) return null;
      const ethersProvider = new ethers.BrowserProvider(provider);
      const signer = await ethersProvider.getSigner();
      return new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI as unknown as string[],
        signer
      );
    },
    []
  );

  return {
    readContract: _readContract,
    getWriteContract,
    CONTRACT_ADDRESS,
  };
}
