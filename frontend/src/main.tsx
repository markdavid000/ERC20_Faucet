import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./context/AppContext";
import "./index.css";

import { createAppKit } from "@reown/appkit/react";
import {
  WALLETCONNECT_PROJECT_ID,
  networks,
  ethersAdapter,
  appKitMetadata,
} from "./config/walletconnect";

createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId: WALLETCONNECT_PROJECT_ID,
  metadata: appKitMetadata,
  features: { analytics: true },
  themeMode: "dark",
  themeVariables: {
    "--apkt-accent": "#8ff5ff",
    "--apkt-color-mix": "#0b0e14",
    "--apkt-color-mix-strength": 20,
    "--apkt-border-radius-master": "8px",
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
