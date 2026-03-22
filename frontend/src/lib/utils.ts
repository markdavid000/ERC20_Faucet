import { ethers } from "ethers";

/**
 * Format a BigInt token amount to a human-readable string
 */
export function formatTokenAmount(
  amount: bigint | string,
  decimals = 18,
  displayDecimals = 2
): string {
  try {
    const formatted = ethers.formatUnits(amount.toString(), decimals);
    const num = parseFloat(formatted);
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
    return num.toFixed(displayDecimals);
  } catch {
    return "0";
  }
}

/**
 * Format a wallet address to shortened form
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a cooldown duration in seconds to human-readable countdown
 */
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

/**
 * Format a percentage for display
 */
export function formatPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.min(100, (value / total) * 100);
}

/**
 * Get relative time string (e.g. "2 mins ago")
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) === 1 ? "" : "s"} ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) === 1 ? "" : "s"} ago`;
  return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) === 1 ? "" : "s"} ago`;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

/**
 * Parse wei value safely
 */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  try {
    return ethers.parseUnits(amount, decimals);
  } catch {
    return 0n;
  }
}
