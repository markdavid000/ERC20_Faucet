import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { liskSepolia } from "@reown/appkit/networks";
import type { AppKitNetwork } from "@reown/appkit/networks";

export const WALLETCONNECT_PROJECT_ID = "88fc16562ff2ee5d213be1e393651a0d";

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [liskSepolia];

export const ethersAdapter = new EthersAdapter();

export const appKitMetadata = {
  name: "MarkToken Faucet",
  description: "Claim MTK tokens from the Synthetic Void faucet",
  url:
    typeof window !== "undefined"
      ? window.location.origin
      : "https://marktoken.app",
  icons: ["https://marktoken.app/icon.png"],
};
