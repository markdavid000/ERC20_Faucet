import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useContract } from "./useContract";

export function useOwner() {
  const [ownerAddress, setOwnerAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { address } = useApp();
  const { readContract } = useContract();

  useEffect(() => {
    (async () => {
      try {
        const owner = await readContract.owner();
        setOwnerAddress(String(owner).toLowerCase());
      } catch {
        setOwnerAddress(null);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwner =
    !!address && !!ownerAddress && address.toLowerCase() === ownerAddress;

  return { ownerAddress, isOwner, loading };
}
