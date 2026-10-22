# Browser storage inventory

Browser storage is script-readable and must contain only public or low-sensitivity UI state. Private
keys, wallet recovery material, authentication/session tokens, signatures, and unsubmitted signing
payloads are prohibited.

| Key / database | Backend | Classification | Contents / owner |
|---|---|---|---|
| `handsoff.addressBook.v1` | localStorage | Public user data | Public Stellar addresses and bounded labels (`lib/wallet/addressBook.ts`) |
| `synapse-transactions-saved-views` | localStorage | UI preference | Filter names and transaction query filters (`lib/filters/savedViews.ts`) |
| caller-provided draft key | localStorage | Public form draft | Admin public addresses and parameters only (`lib/forms/useDraftPersistence.ts`) |
| dashboard layout key | localStorage | UI preference | Widget order and visibility (`lib/dashboard/layoutPreferences.ts`) |
| wallet selection key | localStorage | Public identifier | Selected public wallet ID (`lib/wallet/storage.ts`) |
| `synapse_wallet_sync_event` | localStorage | Ephemeral public state | Cross-tab wallet connection state (`lib/wallet/sync.ts`) |
| `synapse-selected-contract` | localStorage | Public identifier | Selected contract ID (`lib/soroban/contractSelection.ts`) |
| `synapse-tracked-contracts` | localStorage | Public user data | Public contract IDs and labels (`lib/soroban/contractSelection.ts`) |
| `soroban-event-cursor:<contract>` | localStorage | Public chain state | Last processed public event cursor |
| feature-flag subject/config keys | localStorage | Anonymous configuration | Random subject ID and validated public flag overrides (`lib/flags`) |
| theme key | localStorage | UI preference | Light/dark theme (`components/Shell.tsx`) |
| onboarding completion key | localStorage | UI preference | Guided-tour completion boolean |
| transaction cache | IndexedDB | Public chain data | Public transaction records (`lib/storage/txCache.ts`) |

There are no file uploads or user-served assets. Static files are build-owned and Next.js assigns
their MIME types; every response also receives `X-Content-Type-Options: nosniff`.
