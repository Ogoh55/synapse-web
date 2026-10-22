import { writeFile } from "node:fs/promises";

const repository = process.env.GITHUB_REPOSITORY ?? "Synapse-bridgez/synapse-web";
const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is required");
const response = await fetch(`https://api.github.com/repos/${repository}/issues?state=open&labels=drips-wave&per_page=100`, {
  headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
});
if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
const issues = (await response.json()).filter((issue) => !issue.pull_request);
const rows = issues.map((issue) => {
  const body = issue.body ?? "";
  const references = [...body.matchAll(/(?:depends on|blocked by|dependency)[^\n]*?#(\d+)/gi)].map((match) => Number(match[1]));
  return { number: issue.number, title: issue.title, url: issue.html_url, dependencies: [...new Set(references)] };
}).sort((left, right) => left.dependencies.length - right.dependencies.length || left.number - right.number);
const lines = ["# Recommended entry issues", "", "Generated from open `drips-wave` issues. Official complexity remains unchanged; ordering uses unresolved dependency count only.", "", "| Issue | Dependencies |", "|---|---:|", ...rows.map((row) => `| [#${row.number} ${row.title.replaceAll("|", "\\|")}](${row.url}) | ${row.dependencies.length} |`), ""];
await writeFile("docs/community/good-first-issues.md", lines.join("\n"));
