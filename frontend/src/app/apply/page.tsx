"use client";

const REPO = "https://github.com/w3osc/web3-opsec-directory";
const SCHEMA_URL = `${REPO}/blob/main/data/company.schema.json`;
const EXAMPLE_URL = `${REPO}/blob/main/data/companies/auditware.json`;
const NEW_PR_URL = `${REPO}/new/main/data/companies`;

const STEPS = [
  {
    n: "1",
    title: "Fork the repo",
    body: (
      <>
        Fork{" "}
        <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
          w3osc/web3-opsec-directory
        </a>{" "}
        on GitHub.
      </>
    ),
  },
  {
    n: "2",
    title: "Create your company JSON",
    body: (
      <>
        Add a file at <code className="bg-surface-raised px-1.5 py-0.5 rounded text-xs">data/companies/your-slug.json</code>.
        Must validate against the{" "}
        <a href={SCHEMA_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
          schema
        </a>
        . See{" "}
        <a href={EXAMPLE_URL} target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
          auditware.json
        </a>{" "}
        as an example.
      </>
    ),
  },
  {
    n: "3",
    title: "Open a PR",
    body: "Submit a pull request to main. The validation CI will run automatically.",
  },
  {
    n: "4",
    title: "Review & merge",
    body: "Maintainers review and merge. Your company goes live within minutes.",
  },
];

export default function ApplyPage() {
  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">List your company</h1>
        <p className="text-gray-400">
          W3OS is open-source and community-curated. Listings are added via pull
          request - no forms, no gatekeeping.
        </p>
      </div>

      <div className="space-y-4 mb-10">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-4 bg-surface-raised border border-surface-border rounded-xl p-5">
            <span className="text-brand font-bold text-lg w-6 shrink-0">{s.n}</span>
            <div>
              <p className="text-white font-medium mb-1">{s.title}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={NEW_PR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary text-center py-3 px-6"
        >
          Open a PR on GitHub →
        </a>
        <a
          href={SCHEMA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-center py-3 px-6 border border-surface-border rounded-lg text-gray-400 hover:border-gray-500 hover:text-white transition-colors text-sm"
        >
          View schema
        </a>
      </div>
    </div>
  );
}

