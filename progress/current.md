# Current Progress

Active feature: `comparador-mercadolibre-source`

## Seed

User requested that the existing `comparador/` app work with Mercado Libre.

## Soil notes

- Existing `comparador-price-comparison` feature is `done` and passed harvest.
- App currently has demo/local data plus unavailable placeholders for real sources.
- Mercado Libre docs expose `/sites/$SITE_ID/search` for item search; examples include `Authorization: Bearer $ACCESS_TOKEN`.
- A direct unauthenticated call to `https://api.mercadolibre.com/sites/MLA/search?q=iphone` returned HTTP 403 from this environment, so the integration must handle credentials/access failures instead of pretending it searched successfully.

## Current state

Trunk shaped and branches pruned for `comparador-mercadolibre-source`. Requirements, design, and implementation tasks are ready for human review. No production code was implemented.

## Roots

- Created `specs/comparador-mercadolibre-source/requirements.md` with R1–R15.
- Covered official Mercado Libre API usage, secure access configuration, result normalization, ARS guard, freshness, rate limits, failure states, and verification expectations.
- Open questions remain around credential provisioning and exact per-query result limits.

## Trunk

- Created `specs/comparador-mercadolibre-source/design.md`.
- Chose a dedicated `comparador/src/sources/mercadolibre.ts` adapter using Mercado Libre's official `https://api.mercadolibre.com/sites/MLA/search` endpoint.
- Design keeps `MELI_ACCESS_TOKEN` server-side, uses encoded query params, defaults to bounded `limit=10`, requests `sort=price_asc`, maps official item fields into the existing result shape, and explicitly handles `401`, `403`, `429`, network/malformed failures, no-results, and incomplete/non-ARS listings.
- Rejected scraping, client-side credential exposure, unauthenticated dependency, and fake Mercado Libre fallback.

## Branches

- Created `specs/comparador-mercadolibre-source/tasks.md` with T1–T15.
- Tasks are executable checklist items mapped to R1–R15, including adapter creation, registry integration, status handling, mapping, ARS guard, and mocked tests/checks.

## Gate

- Feature status changed to `spec_ready`.
- Human approval is required before `fruit-grower` may implement production code.
- User agreed with the `MELI_ACCESS_TOKEN` environment-variable approach.
- Work is paused until the next session; implementation has not started.

---

## Previous completed feature: `comparador-price-comparison`

## Seed

User requested an app in a local `comparador/` folder that compares internet prices for an article the user enters, focused on Argentina.

## Soil notes

- Current Orange SDD harness has no active feature.
- `feature_list.json` enforces one active feature and explicit approval before growing fruit.
- User clarified the target is a folder inside the current project: `comparador/`.

## Current state

Trunk shaped and branches pruned for `comparador-price-comparison`. Requirements, design, and implementation tasks are ready for human review.

## Roots

- Created `specs/comparador-price-comparison/requirements.md`.
- Covered user-entered queries, Argentina-relevant sources, ARS display, source links, freshness, comparison display, empty/error states, responsible source access, and explicit MVP boundaries.
- Open questions remain around the exact first source set and whether shipping/installments/stock belong in MVP.

## Trunk

- Created `specs/comparador-price-comparison/design.md`.
- Chose a local Next.js TypeScript app in `comparador/` for a small MVP with server-side source adapters and a React UI.
- Design explicitly avoids unsafe scraping assumptions: source adapters must prefer official APIs or allowed access and surface blocked/disallowed sources as unavailable.

## Branches

- Created `specs/comparador-price-comparison/tasks.md`.
- Tasks are small executable checklist items mapped to R1–R13.

## Gate

- Human approval received. Implementation may begin through `fruit-grower` following approved tasks.

## Fruit

- Status changed to `growing`.
- Implementation delegated next; orchestrator must not write production code directly.
- Implemented MVP in `comparador/` following approved tasks T1–T17.
- Source registry uses a local demo adapter and marks real sources unavailable until permitted API/feed/endpoint access is confirmed; no irresponsible scraping was added.
- Added focused Vitest test files for formatting, normalization, query validation, and unavailable-source behavior. Tests were not executed because dependencies are not installed and repo instruction says not to build.
- Feature status moved to `harvest_ready` for review by `harvest-inspector`.

## Harvest

- Review completed by `harvest-inspector`.
- Verdict: PASS.
- R1–R13 traced to tasks and implementation.
- T1–T17 reasonably reflected in code/docs.
- No irresponsible scraping, no fake real-source results, and no out-of-scope account/payment/history/alert/browser-extension/purchase flows found.
- Feature status moved to `done` in `feature_list.json`.
