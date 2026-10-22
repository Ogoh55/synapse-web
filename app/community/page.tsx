import contributorData from "@/public/contributors.json";
import { DripsWidget } from "@/components/community/DripsWidget";

export default function CommunityPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1>Community</h1>
      <p>Recognition is scoped to merged pull requests carrying the configured Drips Wave label.</p>
      <ol>
        {contributorData.contributors.map((contributor) => (
          <li key={contributor.login}>
            <a href={`https://github.com/${contributor.login}`}>{contributor.login}</a>{" — "}
            {contributor.mergedPullRequests} merged PRs, {contributor.issuesResolved} issues resolved
          </li>
        ))}
      </ol>
      {contributorData.contributors.length === 0 && <p>No qualifying contributions recorded yet.</p>}
      <DripsWidget />
    </main>
  );
}
