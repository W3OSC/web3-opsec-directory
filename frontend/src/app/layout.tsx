import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import Nav from "@/components/Nav";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://w3os.org"
  ),
  title: {
    default: "W3OS - Web3 Security Directory",
    template: "%s | W3OS",
  },
  description:
    "Curated directory of web3 security firms offering opsec, web2, and infrastructure security services.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "W3OS",
  },
  twitter: {
    card: "summary_large_image",
    site: "@w3os",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
          <Nav />
          <main className="max-w-6xl mx-auto px-4">{children}</main>
          <footer className="border-t border-surface-border mt-20">
            <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-gray-500 flex justify-between">
              <span>© {new Date().getFullYear()} W3OS</span>
              <a href="/apply" className="hover:text-brand transition-colors">
                List your company
              </a>
            </div>
          </footer>
      </body>
    </html>
  );
}
