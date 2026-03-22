import { useState, useCallback, useEffect, useRef } from "react";
import { ethers } from "ethers";
import { useContract } from "./useContract";
import { formatCountdown } from "../lib/utils";

interface CooldownInfo {
  lastClaimed: number;
  nextClaimAt: number;
  cooldownRemaining: number;
  canClaim: boolean;
  formatted: string;
}

export function useCooldownOf(address?: string) {
  const [info, setInfo] = useState<CooldownInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [liveSeconds, setLiveSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { readContract } = useContract();

  const fetchCooldown = useCallback(async (addr: string) => {
    if (!ethers.isAddress(addr)) return;
    setLoading(true);
    try {
      const [lastClaimed, cooldown] = await Promise.all([
        readContract.lastClaimed(addr),
        readContract.COOLDOWN(),
      ]);

      const now = Math.floor(Date.now() / 1000);
      const nextClaimAt = Number(lastClaimed) + Number(cooldown);
      const cooldownRemaining = Math.max(0, nextClaimAt - now);

      const result: CooldownInfo = {
        lastClaimed: Number(lastClaimed),
        nextClaimAt,
        cooldownRemaining,
        canClaim: cooldownRemaining === 0,
        formatted: formatCountdown(cooldownRemaining),
      };
      setInfo(result);
      setLiveSeconds(cooldownRemaining);
    } catch (err) {
      console.error("[useCooldownOf]", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (liveSeconds > 0) {
      timerRef.current = setInterval(() => {
        setLiveSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [liveSeconds]);

  useEffect(() => {
    if (address && ethers.isAddress(address)) {
      fetchCooldown(address);
    }
  }, [address, fetchCooldown]);

  return {
    info,
    loading,
    liveSeconds,
    formattedLive: formatCountdown(liveSeconds),
    fetchCooldown,
  };
}
