const TAG_STYLES: Record<string, string> = {
  opsec:             "bg-orange-500/10 border-orange-500/40 text-orange-400",
  web2:              "bg-gray-500/10 border-gray-500/40 text-gray-300",
  "smart-contracts": "bg-violet-500/10 border-violet-500/40 text-violet-400",
  devops:            "bg-sky-500/10 border-sky-500/40 text-sky-400",
  training:          "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
  dns:               "bg-pink-500/10 border-pink-500/40 text-pink-400",
  "incident-response": "bg-red-500/10 border-red-500/40 text-red-400",
};

// Tags displayed in the card's vertical right column use a compact block style.
// The "pill" `.tag` class is kept in globals.css for any other uses (detail page, etc).
export default function TagBadge({ tag, compact = true }: { tag: string; compact?: boolean }) {
  const style = TAG_STYLES[tag] ?? "bg-gray-500/10 border-gray-500/40 text-gray-400";
  if (compact) {
    return (
      <span
        className={`${style} border rounded-sm px-2 py-0.5 text-[10px] font-medium whitespace-nowrap`}
      >
        {tag}
      </span>
    );
  }
  return <span className={`tag ${style}`}>{tag}</span>;
}
