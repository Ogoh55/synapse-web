"use client";

import { useEffect, useState } from "react";

type FundingSummary = {
  project?: string;
  total?: string;
  currency?: string;
  splits?: Array<{ name?: string; percentage?: number }>;
};

export function DripsWidget() {
  const endpoint = process.env.NEXT_PUBLIC_DRIPS_PROJECT_API;
  const [data, setData] = useState<FundingSummary | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!endpoint) return;
    const controller = new AbortController();
    fetch(endpoint, { signal: controller.signal, headers: { Accept: "application/json" } })
      .then((response) => {
        if (!response.ok) throw new Error("Drips request failed");
        return response.json() as Promise<FundingSummary>;
      })
      .then(setData)
      .catch((requestError: unknown) => {
        if ((requestError as Error).name !== "AbortError") setError(true);
      });
    return () => controller.abort();
  }, [endpoint]);

  return (
    <section aria-labelledby="drips-heading">
      <h2 id="drips-heading">Funding transparency</h2>
      {!endpoint && <p>Drips funding data has not been configured for this deployment.</p>}
      {endpoint && !data && !error && <p role="status">Loading public Drips funding data…</p>}
      {error && <p role="alert">Funding data is temporarily unavailable.</p>}
      {data && (
        <div>
          <p>{data.project ?? "Synapse"}: {data.total ?? "—"} {data.currency ?? ""}</p>
          {data.splits?.length ? (
            <ul>{data.splits.map((split, index) => <li key={`${split.name}-${index}`}>{split.name ?? "Recipient"}: {split.percentage ?? 0}%</li>)}</ul>
          ) : <p>No public split recipients are configured.</p>}
        </div>
      )}
    </section>
  );
}
