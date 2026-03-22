// Replace CONTRACT_ADDRESS with your deployed contract address
export const CONTRACT_ADDRESS = "0x9A1132a0184f63F86B75Ef392Ad732A7959688b1";

export const CONTRACT_ABI = [
  // Events
  "event TokensClaimed(address indexed claimant, uint256 amount, uint256 nextClaimAt)",
  "event TokensMinted(address indexed to, uint256 amount, uint256 newTotalSupply)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",

  // Read Functions
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function owner() view returns (address)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function CLAIM_AMOUNT() view returns (uint256)",
  "function COOLDOWN() view returns (uint256)",
  "function lastClaimed(address account) view returns (uint256)",

  // Write Functions
  "function requestToken() external",
  "function mint(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function renounceOwnership() external",
  "function transferOwnership(address newOwner) external",
] as const;

export const SUPPORTED_CHAIN_ID = 4202;
export const NETWORK_NAME = "Lisk Sepolia";
export const BLOCK_EXPLORER = "https://sepolia-blockscout.lisk.com";
