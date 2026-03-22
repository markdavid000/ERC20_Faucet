// ignition/modules/MarkToken.ts

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_INITIAL_SUPPLY = 1_000_000n * 10n ** 18n;

const MarkTokenModule = buildModule("MarkTokenModule", (m) => {
  const initialSupply = m.getParameter("initialSupply", DEFAULT_INITIAL_SUPPLY);

  const markToken = m.contract("MarkToken", [initialSupply]);

  return { markToken };
});

export default MarkTokenModule;
