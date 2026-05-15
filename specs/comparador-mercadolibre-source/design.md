# Design — comparador-mercadolibre-source

## Decision

Add a dedicated Mercado Libre Argentina source adapter at `comparador/src/sources/mercadolibre.ts` and register it from `comparador/src/sources/index.ts` only as an official API source. The adapter shall call Mercado Libre's item search endpoint for Argentina:

```text
GET https://api.mercadolibre.com/sites/MLA/search?q=<encoded-query>&limit=<bounded-limit>&sort=price_asc
Authorization: Bearer <server-side-token>
```

The token shall be read server-side from `MELI_ACCESS_TOKEN`. It must never be hard-coded, committed, logged, or exposed to the browser. If the variable is absent or blank, Mercado Libre remains configured as unavailable for that request and returns zero results with a clear `SourceStatus` message.

Why: the existing app already has a server-side source adapter boundary, a source registry, a search service, normalized `PriceResult`, `SourceStatus`, formatting, and tests. Extending that seam keeps the integration small, testable, and aligned with the responsible-access rule: official/permitted API only, no scraping, no fake Mercado Libre fallback.

## Adapter behavior

- Adapter id: `mercado-libre-argentina`.
- Source name: `Mercado Libre Argentina`.
- Source type: `marketplace`.
- Access method: `official_api` when `MELI_ACCESS_TOKEN` exists; otherwise return `unavailable` status for searches.
- Endpoint: `https://api.mercadolibre.com/sites/MLA/search`.
- Query params:
  - `q`: trimmed user query via `URLSearchParams`, not manual string concatenation.
  - `limit`: default `10`, kept as a small bounded constant unless requirements are later changed.
  - `sort`: `price_asc` so returned listings are naturally useful for comparison.
- Timeout/network failures: treat as source-level `error`; preserve other source results through the existing search service.
- No fallback data: if Mercado Libre cannot be reached or authorized, return zero Mercado Libre results and a status explaining the failure.

## Response mapping

The adapter shall parse only the fields needed for the app's existing normalized shape:

| Mercado Libre field | App field |
| --- | --- |
| `id` | used to derive a stable raw/item identity if the adapter or future normalizer supports it; otherwise preserved through deterministic ordering/tests |
| `title` | `RawPriceResult.title` |
| `price` | `RawPriceResult.priceArs` after numeric validation |
| `currency_id` | must be `ARS`; non-ARS items are excluded |
| `permalink` | `RawPriceResult.listingUrl` |
| retrieval time | `RawPriceResult.retrievedAt` as `new Date().toISOString()` captured once per search |

Listings missing `title`, numeric `price`, `currency_id === "ARS"`, or `permalink` shall be excluded rather than displayed partially. The adapter should tolerate extra API fields without depending on them.

## Status handling

- Missing/blank `MELI_ACCESS_TOKEN`: `unavailable`, with a configuration-focused message.
- HTTP `401` or `403`: `unavailable`, with an authorization/access message; no fake Mercado Libre results.
- HTTP `429`: `rate_limited`, no aggressive retries.
- Other non-2xx HTTP responses: `error`, with a generic source failure message that does not leak credentials.
- Network error, timeout, JSON parse error, or malformed response shape: `error`.
- Successful response with zero usable listings: `ok` with zero results and a no-results-aware message.
- Successful response with only non-ARS or incomplete listings: `ok` with zero usable comparable results and a message that no ARS comparable listings were returned.

## Registry integration

`comparador/src/sources/index.ts` shall replace the existing Mercado Libre unavailable placeholder with the real adapter factory/export. The adapter itself decides availability from server-side runtime configuration, keeping registry setup simple and avoiding token access in UI code.

The existing demo/local source may remain clearly labeled as demo data. It must not be presented as Mercado Libre data under any failure condition.

## Tests and checks expected

Add focused Vitest coverage for the adapter and registry behavior without calling the real Mercado Libre API:

- missing `MELI_ACCESS_TOKEN` returns `unavailable` and no results.
- successful API response maps `title`, `price`, `currency_id: "ARS"`, `permalink`, and `retrievedAt` into usable raw results.
- non-ARS listings are excluded.
- missing price/permalink/title listings are excluded.
- empty API results produce `ok` with zero results.
- `401`, `403`, `429`, generic non-2xx, network failure, and malformed response produce the expected `SourceStatus`.
- request URL uses `/sites/MLA/search`, encoded query params, `limit=10`, and `sort=price_asc`.
- no test expects demo/local fallback as Mercado Libre data.

Allowed verification commands for implementers/reviewers should be limited to targeted tests and type checks such as `npm test` or `npm run typecheck` inside `comparador/` if available. Per repo instruction, do **not** run a production build.

## Alternatives considered

- **Unauthenticated Mercado Libre search call**: rejected because a direct check from this environment returned `403`, and relying on unauthenticated behavior would make failures ambiguous and brittle.
- **Scraping Mercado Libre pages**: rejected because requirements explicitly demand official/permitted API access and no bypassing access controls.
- **Client-side Mercado Libre calls from React**: rejected because it would expose credentials or run into browser/CORS constraints. Source access belongs behind the existing server-side route and adapter boundary.
- **Fake Mercado Libre fallback when API fails**: rejected because it would mislead the user and violate the no-fake-data requirements.

## Open decisions before implementation

- Confirm how `MELI_ACCESS_TOKEN` will be provisioned locally and in any deployment environment.
- Confirm whether the default result limit of `10` is acceptable or should become a documented runtime setting later.
