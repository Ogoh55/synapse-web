import { writeFile } from "node:fs/promises";

const token = process.env.GITHUB_TOKEN;
const repository = process.env.GITHUB_REPOSITORY ?? "Synapse-bridgez/synapse-web";
const label = process.env.CONTRIBUTOR_SCOPE_LABEL ?? "drips-wave";
if (!token) throw new Error("GITHUB_TOKEN is required");
const [owner, name] = repository.split("/");
const query = `query($owner:String!,$name:String!,$label:String!){repository(owner:$owner,name:$name){pullRequests(first:100,states:MERGED,labels:[$label]){nodes{author{login}closingIssuesReferences(first:20){totalCount}}}}}`;
const response = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query, variables: { owner, name, label } }),
});
if (!response.ok) throw new Error(`GitHub GraphQL returned ${response.status}`);
const payload = await response.json();
if (payload.errors) throw new Error(payload.errors.map((error) => error.message).join("; "));
const totals = new Map();
for (const pullRequest of payload.data.repository.pullRequests.nodes) {
  const login = pullRequest.author?.login;
  if (!login) continue;
  const current = totals.get(login) ?? { login, mergedPullRequests: 0, issuesResolved: 0 };
  current.mergedPullRequests += 1;
  current.issuesResolved += pullRequest.closingIssuesReferences.totalCount;
  totals.set(login, current);
}
const contributors = [...totals.values()].sort((left, right) => right.mergedPullRequests - left.mergedPullRequests || left.login.localeCompare(right.login));
await writeFile("public/contributors.json", `${JSON.stringify({ generatedAt: new Date().toISOString(), scope: `label:${label}`, contributors }, null, 2)}\n`);
