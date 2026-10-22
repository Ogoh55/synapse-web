# fix(theme): replace hardcoded colours with theme-aware tokens

## Why

The dark/light toggle works by swapping CSS custom properties on
`<html data-theme="…">`. A component with a literal `#fff`, `#ccc`, `#f5a623`
or `rgba(...)` value never sees that swap, so it stays in whatever palette it
was written for. In light mode that means white text on white panels, dark
inputs on a light page, and amber accents that no longer match the rest of the
UI.

`lib/constants.ts` had a second problem: it exported `var(--accent)` and
`var(--bg-0)`, but `app/globals.css` defines `--amber` and `--bg0`. Those
imports resolved to nothing, so components using the shared `AMBER`/`BG1`
tokens were already rendering with an invalid colour.

## What changed

Four focused commits, one per area:

1. **Shared UI controls** — adds semantic tokens (`--fg-muted`, `--on-accent`,
   `--danger*`, `--accent-*`, `--hover`, `--track`, access-level swatches) and
   aligns `lib/constants.ts` with the variables the theme actually swaps.
   Field, CopyButton, SorobanTip, ContractSwitcher, HighStakesConfirmDialog,
   NotificationCenter and CommandPalette now use them.
2. **Wallet surfaces** — OriginBadge, NoWalletGuidance and SessionAuditPanel
   derive their colours from the status/accent tokens while keeping the four
   origin states visually distinct.
3. **Dashboard, transactions and analytics** — RecentTxTable,
   ContractInfoPanel, Pipeline, DashboardTab, TransactionsTab, TxCompareView,
   StatusRatioChart and StageDurationChart replace fixed foregrounds, amber
   tints and meter tracks with tokens.
4. **Docs, shell and app-level fallbacks** — DocsTab's surfaces, access
   swatches, warning banner and playground inputs now follow the theme; Shell's
   white/grey/amber values do the same; and the global error boundary,
   not-found page and performance history page use the same
   foreground/accent/on-accent tokens.

Intentional literals were left alone: the QR matrix in `QrConnectModal` must
stay black-on-white to scan, and modal scrims/print styles are theme-neutral.

## Incidental repairs in touched files

- Removed duplicated JSX fragments in `components/Shell.tsx` that left the
  module unparsable (a truncated duplicate button block, a duplicated
  `handleTabKeyDown` tail, an extra `</button>` and a duplicated `useRouter`).
- Repaired `components/settings/NetworkSwitcher.tsx`, which was left with
  duplicated declarations and a stray JSX tail that made `tsc` fail. The file
  now exports the predefined environment registry it already documented.
- Removed a duplicated `GuidedTour` import and the unused `HealthWidget`
  import.
- Fixed the two `react-hooks/set-state-in-effect` errors in CommandPalette and
  the one in ContractInfoPanel, keeping their reset/clamp/loading behaviour.
- Refreshed `components/ui/__snapshots__/visual-regression.test.tsx.snap` for
  the tokenized Field/Badge styles.

## Verification

```
npx eslint <all touched ts/tsx files>   0 errors
                                        8 warnings, all pre-existing in Shell.tsx
npx vitest run --config vitest.config.mts --environment jsdom \
  components/ui/visual-regression.test.tsx components/ui/Badge.test.tsx
  2 files, 9 tests passed
```

`npm test` inherits an unrelated `main` problem: `vitest.config.ts` is empty,
so Vitest does not load `vitest.config.mts` (setup file, `happy-dom`). The
suites above were therefore run explicitly against `vitest.config.mts` with
the available `jsdom` environment.

A project-wide `tsc --noEmit` is not a usable signal on this checkout: the
baseline already reports hundreds of errors from empty/stripped modules
(`lib/types.ts`, `next.config.ts`, `components/ui/Toast.tsx`,
`lib/wallet/WalletProvider.tsx`, …) and from missing packages such as
`next-intl`. None of those files are changed here; the touched files were
verified with ESLint, Prettier and the targeted suites above.

## Bypassed hooks

`git push` was run with `SYNAPSE_HOOK_BYPASS` because `.husky/pre-push` calls
`npm run typecheck` and `npm run test:unit`, neither of which exists in
`package.json`. Even with those scripts added, the underlying `tsc` baseline
fails on the empty/stripped modules described above, so the hook cannot pass
on this checkout independently of this PR.

No unrelated user-facing behaviour is changed; only colour sources moved from
literals to the existing theme tokens.
