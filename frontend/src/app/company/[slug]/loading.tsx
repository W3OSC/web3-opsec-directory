export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-4 w-24 bg-surface-border rounded mb-8" />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-xl bg-surface-border flex-shrink-0" />
        <div className="space-y-2">
          <div className="h-6 w-48 bg-surface-border rounded" />
          <div className="h-4 w-32 bg-surface-border rounded" />
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-surface-border rounded" />
        <div className="h-4 w-4/5 bg-surface-border rounded" />
        <div className="h-4 w-3/5 bg-surface-border rounded" />
      </div>
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-16 bg-surface-border rounded-full" />
        ))}
      </div>
      <div className="flex gap-3">
        <div className="h-9 w-24 bg-surface-border rounded-lg" />
        <div className="h-9 w-24 bg-surface-border rounded-lg" />
      </div>
    </div>
  );
}
