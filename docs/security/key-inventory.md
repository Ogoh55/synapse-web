# Client-Exposed Key Inventory

This document inventories every key or identifier that is shipped in the client-side
bundle (and is therefore inherently public once released). Because these values are
readable by anyone who inspects the bundle, they are not secrets in the traditional
sense — but they can still be abused (e.g. scraped and used to run up usage against
the project's quota). Each entry below therefore has a documented owner, exposure
surface, rotation cadence, and rotation procedure.

## Inventory

| Key / Identifier | Provider | Exposure surface | Owner | Rotation cadence | Last review | Q4 2026 decision | Rotation procedure |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Telemetry provider public key (e.g. Sentry DSN / public write key) | Error telemetry provider | Client bundle (`NEXT_PUBLIC_*` / `VITE_*` env var) | Frontend platform team | Quarterly | 2026-10-18 | Retain; no abuse evidence in repository-visible configuration | Manual — see below |
| Web Vitals reporting identifier (e.g. analytics/site ID) | Web Vitals / analytics provider | Client bundle (`NEXT_PUBLIC_*` / `VITE_*` env var) | Frontend platform team | Quarterly | 2026-10-18 | Retain; public identifier with provider-side quota monitoring | Manual — see below |
| RPC provider key (if a client-side RPC provider is used) | RPC provider | Client bundle (`NEXT_PUBLIC_*` / `VITE_*` env var) | Frontend platform team | Quarterly | 2026-10-18 | Rotate only when configured; current default RPC requires no client key | Manual — see below |

> If a future feature introduces a new client-exposed key or identifier, add a row to
> this table in the same PR that introduces it. This is part of the PR review
> checklist (see `.github/PULL_REQUEST_TEMPLATE.md`).

## Rotation cadence

All client-exposed keys are reviewed **quarterly**. The scheduled workflow
`.github/workflows/key-rotation-reminder.yml` opens a tracking issue every quarter
listing every key above and prompting a review/rotation decision for each one.

A key should be rotated immediately (outside the quarterly cadence) if there is
evidence of abuse, unexpected quota consumption, or a provider-reported compromise.

The Q4 2026 review found no additional client-exposed key categories in tracked configuration.
Provider dashboards remain the authoritative source for quota-abuse evidence and must be checked by
the listed owner before recording the next quarterly decision.

## Manual rotation procedure

None of the third-party services above currently support programmatic key rotation,
so rotation is a manual process:

1. In the provider's dashboard, generate a new key/identifier.
2. Update the corresponding environment variable in the deployment configuration
   (and in any local `.env` files used for development).
3. Deploy the change so the new value is included in the client bundle.
4. Verify telemetry / Web Vitals / RPC traffic is still being reported correctly.
5. Revoke the old key/identifier in the provider's dashboard once the new value is
   confirmed live.
6. Update the "last rotated" date for the key in this document.

## Keeping the inventory current

Any PR that introduces a new third-party integration with a client-exposed key must:

- Add the key to the inventory table above.
- Confirm the rotation cadence and procedure are documented.

This requirement is enforced via the PR review checklist.
