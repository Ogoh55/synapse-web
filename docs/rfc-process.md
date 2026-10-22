# RFC process

Use an RFC for changes that establish shared architecture, alter security or wallet-signing
boundaries, introduce a major dependency, or change a public contract. Routine fixes and localized
features do not need one.

1. Open the RFC issue template and add the `rfc` label.
2. Leave at least seven calendar days for comments; material revisions reset the final 48 hours.
3. Resolve or explicitly record every open question and alternative.
4. A CODEOWNER or repository maintainer records `accepted`, `rejected`, or `needs-revision` with a
   decision rationale. Maintainers retain final sign-off so proposals cannot stall indefinitely.
5. Link accepted RFCs from implementation PRs and close them only after the decision is recorded.

The issue itself is the proposal tracker and durable decision record.
