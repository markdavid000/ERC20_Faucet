interface EthersError {
  code?: string | number;
  reason?: string;
  shortMessage?: string;
  message?: string;
  data?: { message?: string };
  info?: { error?: { message?: string } };
}

export function parseContractError(err: unknown): string {
  if (!err || typeof err !== "object") return "An unexpected error occurred.";

  const e = err as EthersError;

  // ── User rejected / cancelled ──────────────────────────────────────────────
  if (
    e.code === "ACTION_REJECTED" ||
    e.code === 4001 ||
    String(e.code) === "ACTION_REJECTED"
  ) {
    return "You cancelled the transaction in your wallet.";
  }

  // ── Insufficient funds ─────────────────────────────────────────────────────
  if (
    e.code === "INSUFFICIENT_FUNDS" ||
    e.message?.includes("insufficient funds") ||
    e.message?.includes("Insufficient funds")
  ) {
    return "Insufficient funds to pay for gas. Please top up your wallet with native tokens.";
  }

  // ── Network / chain mismatch ───────────────────────────────────────────────
  if (
    e.code === "NETWORK_ERROR" ||
    e.message?.includes("network") ||
    e.message?.includes("chain")
  ) {
    return "Network error. Please check you're connected to the correct network and try again.";
  }

  // ── Contract custom errors (revert reasons) ────────────────────────────────
  // Try shortMessage first (ethers v6)
  const short = e.shortMessage ?? "";

  if (short.includes("CooldownNotElapsed") || short.includes("Cooldown")) {
    return "You're still in cooldown. Please wait the full 24 hours before claiming again.";
  }
  if (short.includes("ExceedsMaxSupply") || short.includes("MaxSupply")) {
    return "This mint would exceed the maximum token supply of 10,000,000 MTK.";
  }
  if (short.includes("InvalidRecipient") || short.includes("address(0)")) {
    return "The recipient address is invalid. Please enter a valid Ethereum address.";
  }
  if (short.includes("ZeroAmount")) {
    return "Amount must be greater than zero.";
  }
  if (
    short.includes("OwnableUnauthorizedAccount") ||
    short.includes("Ownable")
  ) {
    return "Access denied — only the contract owner can perform this action.";
  }
  if (
    short.includes("ERC20InsufficientBalance") ||
    short.includes("insufficient balance")
  ) {
    return "Insufficient MTK balance to complete this transfer.";
  }
  if (
    short.includes("ERC20InvalidSpender") ||
    short.includes("ERC20InvalidReceiver")
  ) {
    return "Invalid token recipient address.";
  }

  // ── Try the reason field ───────────────────────────────────────────────────
  if (e.reason) {
    return humanizeReason(e.reason);
  }

  // ── Try nested data / info error messages ─────────────────────────────────
  const nested = e.data?.message ?? e.info?.error?.message ?? "";

  if (nested) return humanizeReason(nested);

  // ── Generic message cleanup ────────────────────────────────────────────────
  if (e.message) {
    return humanizeReason(e.message);
  }

  return "An unexpected error occurred. Please try again.";
}

function humanizeReason(raw: string): string {
  // Strip common ethers v6 prefixes
  let msg = raw
    .replace(/^execution reverted:/i, "")
    .replace(/^Error:/i, "")
    .replace(/^reverted with reason string/i, "")
    .replace(/^VM Exception while processing transaction:/i, "")
    .trim();

  // Map known technical messages to human language
  const knownMap: [RegExp, string][] = [
    [
      /cooldown/i,
      "You're still in the 24-hour cooldown period. Please try again later.",
    ],
    [/max.?supply/i, "This would exceed the maximum token supply."],
    [/invalid.?recipient/i, "The recipient address is not valid."],
    [/zero.?amount/i, "The amount cannot be zero."],
    [/ownable|not owner/i, "Only the contract owner can perform this action."],
    [
      /insufficient.?balance/i,
      "You don't have enough MTK to complete this transfer.",
    ],
    [
      /nonce/i,
      "Transaction nonce error. Please reset your wallet's transaction history and try again.",
    ],
    [/gas/i, "Transaction ran out of gas. Try increasing your gas limit."],
    [
      /timeout|timed out/i,
      "The transaction timed out. Please check your network connection.",
    ],
    [
      /already.?claimed/i,
      "You have already claimed your tokens for this period.",
    ],
  ];

  for (const [pattern, human] of knownMap) {
    if (pattern.test(msg)) return human;
  }

  // If message is still very long / technical, truncate it gracefully
  if (msg.length > 120) {
    msg = msg.slice(0, 117) + "…";
  }

  // Capitalize first letter
  return (
    msg.charAt(0).toUpperCase() + msg.slice(1) ||
    "An unexpected error occurred."
  );
}
