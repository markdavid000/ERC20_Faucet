import { useCallback, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { useContract } from "./useContract";
import { formatTokenAmount } from "../lib/utils";

export function useContractRead() {
  const {
    address,
    isConnected,
    setContractStats,
    setStatsLoading,
    setUserStats,
    setUserStatsLoading,
  } = useApp();

  const { readContract } = useContract();

  const fetchingStats = useRef(false);
  const fetchingUser = useRef(false);

  const fetchContractStats = useCallback(async () => {
    if (fetchingStats.current) return;
    fetchingStats.current = true;
    setStatsLoading(true);
    try {
      const [
        name,
        symbol,
        decimals,
        totalSupply,
        maxSupply,
        claimAmount,
        cooldown,
      ] = await Promise.all([
        readContract.name(),
        readContract.symbol(),
        readContract.decimals(),
        readContract.totalSupply(),
        readContract.MAX_SUPPLY(),
        readContract.CLAIM_AMOUNT(),
        readContract.COOLDOWN(),
      ]);

      setContractStats({
        name: String(name),
        symbol: String(symbol),
        decimals: Number(decimals),
        totalSupply: formatTokenAmount(totalSupply as bigint),
        maxSupply: formatTokenAmount(maxSupply as bigint),
        claimAmount: formatTokenAmount(claimAmount as bigint),
        cooldown: Number(cooldown),
      });
    } catch (err) {
      console.error("[useContractRead] fetchContractStats error:", err);
    } finally {
      setStatsLoading(false);
      fetchingStats.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setContractStats, setStatsLoading]);

  const fetchUserStats = useCallback(async () => {
    if (!address) return;
    if (fetchingUser.current) return;
    fetchingUser.current = true;
    setUserStatsLoading(true);
    try {
      const [balance, lastClaimed, cooldown] = await Promise.all([
        readContract.balanceOf(address),
        readContract.lastClaimed(address),
        readContract.COOLDOWN(),
      ]);

      const now = Math.floor(Date.now() / 1000);
      const nextClaimAt = Number(lastClaimed) + Number(cooldown);
      const cooldownRemaining = Math.max(0, nextClaimAt - now);

      setUserStats({
        balance: formatTokenAmount(balance as bigint),
        lastClaimed: Number(lastClaimed),
        nextClaimAt,
        canClaim: cooldownRemaining === 0,
        cooldownRemaining,
      });
    } catch (err) {
      console.error("[useContractRead] fetchUserStats error:", err);
    } finally {
      setUserStatsLoading(false);
      fetchingUser.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, setUserStats, setUserStatsLoading]);

  useEffect(() => {
    fetchContractStats();
  }, [fetchContractStats]);

  useEffect(() => {
    if (isConnected && address) {
      fetchUserStats();
    } else {
      setUserStats(null);
    }
  }, [isConnected, address, fetchUserStats, setUserStats]);

  return { fetchContractStats, fetchUserStats };
}
