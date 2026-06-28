export type ToolCategory = {
  name: string;
  slugs: string[];
};

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: "OpSec",
    slugs: [
      "web3-opsec-standard",
      "seal-frameworks",
      "oss-security",
      "seal-safe-harbor",
      "web3-opsec-directory",
    ],
  },
  {
    name: "DevOps",
    slugs: [
      "red-guild-devcontainer",
      "red-guild-devcontainer-wizard",
      "depenemy",
      "digibastion",
    ],
  },
  {
    name: "AI",
    slugs: ["skill-warden", "conduit"],
  },
  {
    name: "Transactions",
    slugs: ["multisigmonitor", "sky-safe-tx-decoder", "seal-blocklists"],
  },
];
