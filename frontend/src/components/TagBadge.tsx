const TAG_STYLES: Record<string, string> = {
  opsec: "bg-orange-500/10 border-orange-500/40 text-orange-400",
  web2: "bg-gray-500/10 border-gray-500/40 text-gray-400",
  infra: "bg-yellow-500/10 border-yellow-500/40 text-yellow-400",
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
