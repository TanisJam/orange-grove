# Harvest Review — comparador-price-comparison

Verdict: PASS

Reviewed by: harvest-inspector  
Date: 2026-05-14

## Scope reviewed

- `CHECKPOINTS.md`
- `feature_list.json`
- `specs/comparador-price-comparison/requirements.md`
- `specs/comparador-price-comparison/design.md`
- `specs/comparador-price-comparison/tasks.md`
- `progress/impl_comparador-price-comparison.md`
- `comparador/` app implementation, including UI, API route, search types/service/normalizer, source registry/adapters, formatter, README, and focused tests.

## Checkpoint result

- Feature entry exists in `feature_list.json`.
- Requirements, design, and tasks exist under `specs/comparador-price-comparison/`.
- R1–R13 are covered by tasks and implementation/verification.
- Completed tasks T1–T17 are reasonably reflected in code or docs.
- Reviewer edited only permitted progress/status files, not production code.
- `progress/current.md` and `progress/history.md` updated for harvest completion.

## Requirement traceability

| Requirement | Evidence | Result |
| --- | --- | --- |
| R1 | `app/page.tsx` free-text search input and submit form. | PASS |
| R2 | `/api/search/route.ts`, `search-service.ts`, `sources/index.ts`; configured adapters are executed, real unconfirmed sources return `unavailable` rather than being scraped. | PASS |
| R3 | Result cards render title, ARS price, source, and listing link; `PriceResult` model contains required fields. | PASS |
| R4 | `src/formatting/money.ts` uses `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`. | PASS |
| R5 | Source name/type included in result model and UI; registry distinguishes marketplace/retailer/store. | PASS |
| R6 | Result model and UI expose `retrievedAt`; demo adapter supplies retrieval timestamp. | PASS |
| R7 | UI sorts by price and renders comparable cards with clear price differences. | PASS |
| R8 | Success with zero results shows clear no-results empty state. | PASS |
| R9 | API and UI expose request-level errors; source statuses expose unavailable/error/rate-limited states without authoritative claims. | PASS |
| R10 | No external scraping implemented; source policy prefers permitted access and blocks unconfirmed real sources. | PASS |
| R11 | Mercado Libre and pending retailer are marked `unavailable`; no bypass logic present. | PASS |
| R12 | MVP scope is query submission, retrieval/status aggregation, ARS display, source links, freshness, empty/error states. | PASS |
| R13 | No accounts, payments, price history, alerts, browser extensions, or purchasing flows found. | PASS |

## Task verification

T1–T17 are marked complete and are reasonably reflected:

- T1–T3: Next.js TypeScript scaffold, query page, and `/api/search` route exist.
- T4–T8: shared types, service orchestration, registry, demo/unavailable adapters, and normalizer exist.
- T9–T12: ARS formatting, comparable result cards, listing links, and freshness are rendered.
- T13–T15: empty, unavailable/source error, and request-level error states exist.
- T16: focused Vitest test files exist for formatting, normalization, validation, demo, and unavailable-source behavior. They were not executed because dependencies are not installed and no install was requested.
- T17: boundary search found no prohibited product features; only expected `role="alert"` accessibility usage.

## Responsible-source review

PASS. There is no irresponsible scraping, browser automation, crawler library, external marketplace fetch, or fake real-source result. The only `fetch` call is the client calling the local `/api/search` route. Real Argentina sources are explicitly represented as unavailable until a permitted API/feed/endpoint is confirmed. Demo results are local, synthetic, and visibly labeled.

## Non-blocking notes

- Tests are present but not executed because `comparador/node_modules` is absent; no dependencies were installed during review.
- The MVP currently has no real online price source with confirmed permitted access. That is acceptable for harvest because the implementation correctly refuses to fake or scrape unconfirmed sources, but the next real-product iteration needs an approved source integration.

## Commands executed

```bash
python3 -m json.tool feature_list.json
python3 -m json.tool comparador/package.json
# conditional: skipped npm test because comparador/node_modules is absent
```

## Final verdict

PASS — ready to mark `done`.
