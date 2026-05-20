"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const onTools = pathname.startsWith("/tools");

  return (
    <nav className="border-b border-surface-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-brand">W3OS</Link>
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <a href={onTools ? "/" : "/tools"} className="hover:text-white transition-colors">
            {onTools ? "Companies" : "Tools"}
          </a>
          <a href="/apply" className="btn-primary text-sm py-1.5">
            {onTools ? "List your project" : "List your company"}
          </a>
        </div>
      </div>
    </nav>
  );
}
