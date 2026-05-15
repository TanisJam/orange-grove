# Implementation — comparador-price-comparison

## Summary

Implemented the MVP Next.js + TypeScript app in `comparador/` according to approved tasks T1–T17.

## Touched files

- `comparador/package.json` — manual Next.js/TypeScript scaffold scripts and dependencies.
- `comparador/tsconfig.json`, `comparador/next-env.d.ts`, `comparador/next.config.ts` — TypeScript/Next configuration.
- `comparador/app/layout.tsx`, `comparador/app/page.tsx`, `comparador/app/styles.css` — UI with query form, loading/error/empty/results states, ARS display, source statuses, freshness, and listing links.
- `comparador/app/api/search/route.ts` — query validation and request-level API errors.
- `comparador/src/search/source-adapter.ts` — `PriceResult`, `SourceStatus`, `SourceAdapter`, and response types.
- `comparador/src/search/search-service.ts` — adapter orchestration, aggregation, sorting, and adapter error capture.
- `comparador/src/search/result-normalizer.ts` — result normalization and invalid result filtering.
- `comparador/src/sources/index.ts`, `comparador/src/sources/demo-local.ts`, `comparador/src/sources/unavailable-source.ts` — permitted registry with local demo source and unavailable real sources.
- `comparador/src/formatting/money.ts` — `Intl.NumberFormat("es-AR", { currency: "ARS" })` formatter.
- `comparador/src/**/*.test.ts` — focused Vitest coverage for formatting, normalization, validation, demo, and unavailable-source behavior.
- `comparador/README.md` — responsible-source policy note.
- `comparador/vitest.config.ts` — Vitest alias config so test resolution matches the Next.js/TypeScript `@/*` path mapping.
- `specs/comparador-price-comparison/tasks.md` — marked T1–T17 complete.
- `feature_list.json` — moved feature to `harvest_ready`.
- `progress/current.md` — updated implementation status.

## Verification notes

- Manual code review against approved requirements/design/tasks completed.
- No production scraping or unconfirmed marketplace access was implemented.
- Real external sources are represented as `unavailable` until allowed access is confirmed.
- Local demo results are clearly marked as synthetic and only returned for queries containing `demo`.
- No accounts, payments, price history, alerts, browser extensions, or purchasing flows were added.
- Ran `python3 -m json.tool` against `feature_list.json` and `comparador/package.json`: passed.
- Searched implementation for boundary-risk terms (`account`, `payment`, `price history`, `alert`, `browser extension`, scraping/tooling terms): only expected policy/copy mentions and UI `role="alert"` were found.
- Build was not run per repository instruction. Tests were added but not executed because dependencies are not installed in `comparador/`.

## Post-install verification fix — 2026-05-14

- Fixed Vitest module resolution for `@/sources` by mapping `@` to `comparador/src` in `comparador/vitest.config.ts`.
- Ran `npm test`: passed, 3 test files / 6 tests.
- Ran `npm run typecheck`: passed.
- Build was not run per instruction.
