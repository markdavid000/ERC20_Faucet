import { ethers } from "ethers";

/**
 * Format a raw BigInt wei amount into a display string.
 * Returns the actual number for small amounts (e.g. "300.00"),
 * "4.20K" for thousands, "4.20M" for millions.
 * NOTE: input must be the raw on-chain value (wei/bigint), not pre-formatted.
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals = 18,
  displayDecimals = 2
): string {
  try {
    const formatted = ethers.formatUnits(amount.toString(), decimals);
    const num = parseFloat(formatted);
    if (num >= 1_000_000)
      return `${(num / 1_000_000).toFixed(displayDecimals)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(displayDecimals)}K`;
    return num.toFixed(displayDecimals);
  } catch {
    return "0.00";
  }
}

/**
 * Parse a raw BigInt wei amount into a plain JS number (no formatting).
 * Used by StatsSection to compute the progress bar ratio.
 */
export function tokenAmountToNumber(
  amount: bigint | string,
  decimals = 18
): number {
  try {
    return parseFloat(ethers.formatUnits(amount.toString(), decimals));
  } catch {
    return 0;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Ready to claim";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(" ");
}

export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (value / total) * 100);
}

export function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  if (diff < 60) return "Just now";
  if (diff < 3600)
    return `${Math.floor(diff / 60)} min${
      Math.floor(diff / 60) === 1 ? "" : "s"
    } ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) === 1 ? "" : "s"
    } ago`;
  return `${Math.floor(diff / 86400)} day${
    Math.floor(diff / 86400) === 1 ? "" : "s"
  } ago`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function parseTokenAmount(amount: string, decimals = 18): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
}
