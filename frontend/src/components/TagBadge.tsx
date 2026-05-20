const TAG_STYLES: Record<string, string> = {
  "seal-certified": "bg-blue-500/10 border-blue-500/40 text-blue-400",
  opsec: "bg-orange-500/10 border-orange-500/40 text-orange-400",
  web3: "bg-cyan-500/10 border-cyan-500/40 text-cyan-400",
  web2: "bg-gray-500/10 border-gray-500/40 text-gray-400",
  infra: "bg-yellow-500/10 border-yellow-500/40 text-yellow-400",
};

export default function TagBadge({ tag }: { tag: string }) {
  const style = TAG_STYLES[tag] ?? "bg-gray-500/10 border-gray-500/40 text-gray-400";
  return <span className={`tag ${style}`}>{tag}</span>;
}
