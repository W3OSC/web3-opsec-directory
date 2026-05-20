"use client";

import { Twitter } from "lucide-react";

const templates = (name: string, url: string) => [
  `if you're not thinking about opsec in web3 you're already behind. ${name} is doing the real work here ${url}`,
  `most web3 teams still treat security as an afterthought. ${name} exists to fix that ${url}`,
  `slept on: ${name}. seriously good people working on web3 opsec ${url}`,
  `the number of web3 teams with zero opsec posture is scary. ${name} is one of the few actually addressing it ${url}`,
  `been down the web3 security rabbit hole lately - ${name} keeps coming up for good reason ${url}`,
];

const toolTemplates = (name: string, url: string) => [
  `this tool deserves more stars - ${name} is genuinely useful for web3 opsec ${url}`,
  `open source and actually good. ${name} is worth bookmarking if you work in web3 security ${url}`,
  `found ${name} while going down the web3 opsec rabbit hole. solid tool, underrated ${url}`,
  `if you're auditing web3 infrastructure, ${name} should be in your toolkit ${url}`,
  `the web3 security tooling space is sparse. ${name} is one of the better ones out there ${url}`,
];

export default function ShareButton({
  name,
  url,
  type = "company",
}: {
  name: string;
  url: string;
  type?: "company" | "tool";
}) {
  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const options = type === "tool" ? toolTemplates(name, url) : templates(name, url);
    const text = options[Math.floor(Math.random() * options.length)];
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <button
      onClick={handleClick}
      className="btn-secondary flex items-center gap-2 text-sm"
    >
      <Twitter size={14} /> Share on X
    </button>
  );
}
