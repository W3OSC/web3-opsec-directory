export const STANDARDS_ORDER = ["SEAL", "W3OS", "DARC", "SOC2"] as const;
export type Standard = (typeof STANDARDS_ORDER)[number];

export type StandardMeta = {
  bg: string;
  border: string;
  borderLeft: string;
  text: string;
  href: string;
  inactiveClass: string;
};

export const STANDARD_META: Record<string, StandardMeta> = {
  SEAL: {
    bg: "bg-[rgb(67,57,219)]/15",
    border: "border-[rgb(67,57,219)]",
    borderLeft: "border-l-[rgb(67,57,219)]",
    text: "text-[rgb(130,123,255)]",
    href: "https://frameworks.securityalliance.org/certs/overview/",
    inactiveClass: "bg-transparent border-surface-border text-gray-500 hover:border-[rgb(67,57,219)]/40 hover:text-[rgb(130,123,255)]/60",
  },
  W3OS: {
    bg: "bg-brand/10",
    border: "border-brand",
    borderLeft: "border-l-brand",
    text: "text-brand",
    href: "https://github.com/W3OSC/web3-opsec-standard",
    inactiveClass: "bg-transparent border-surface-border text-gray-500 hover:border-brand/40 hover:text-brand/60",
  },
  DARC: {
    bg: "bg-[rgb(232,255,106)]/10",
    border: "border-[rgb(232,255,106)]",
    borderLeft: "border-l-[rgb(232,255,106)]",
    text: "text-[rgb(232,255,106)]",
    href: "https://darcstandard.org",
    inactiveClass: "bg-transparent border-surface-border text-gray-500 hover:border-[rgb(232,255,106)]/40 hover:text-[rgb(232,255,106)]/60",
  },
  SOC2: {
    bg: "bg-rose-500/10",
    border: "border-rose-400",
    borderLeft: "border-l-rose-400",
    text: "text-rose-400",
    href: "https://www.vanta.com/collection/soc-2/what-is-soc-2",
    inactiveClass: "bg-transparent border-surface-border text-gray-500 hover:border-rose-400/40 hover:text-rose-400/60",
  },
};

const FALLBACK: StandardMeta = {
  bg: "bg-gray-500/10",
  border: "border-gray-500",
  borderLeft: "border-l-gray-500",
  text: "text-gray-400",
  href: "#",
  inactiveClass: "bg-transparent border-surface-border text-gray-500",
};

export function getStandardMeta(standard: string): StandardMeta {
  return STANDARD_META[standard] ?? FALLBACK;
}
