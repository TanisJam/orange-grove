# Design — comparador-price-comparison

## Decision

Build the MVP as a local TypeScript web app in `comparador/` using **Next.js** with server-side route handlers for source access and a small React UI for query entry and comparison results.

This keeps the first version simple: one local app, one language, one dev server, and a clear boundary between UI and source retrieval. Server-side route handlers avoid browser CORS issues and keep source credentials or API keys out of the client if an approved source requires them.

## MVP architecture

```text
comparador/
  app/
    page.tsx                  # query form + result states
    api/search/route.ts        # validates query, runs source adapters
  src/
    search/
      source-adapter.ts        # common adapter contract
      search-service.ts        # orchestrates configured adapters
      result-normalizer.ts     # normalizes prices and metadata
    sources/
      <source-name>.ts         # one adapter per permitted source
      index.ts                 # configured source registry
    formatting/
      money.ts                 # ARS locale formatting
```

## Source access policy

The app shall not assume scraping is allowed. Each source adapter must declare:

- source name and type: marketplace, retailer, or store website
- access method: official API, authorized feed, allowed public endpoint, or unavailable
- rate-limit behavior, if documented by the source
- result freshness timestamp from retrieval time or source metadata

For the MVP, adapters should prefer official APIs or explicitly permitted public endpoints. If a source blocks automated access, disallows scraping, requires unavailable authorization, or cannot be accessed responsibly, the adapter must return a source-level `unavailable` status rather than bypassing restrictions.

Search responses should distinguish:

- complete success with results
- complete success with no results
- partial source unavailability, shown with source context
- request-level failure when the search cannot be completed reliably

This satisfies the responsible-access requirements without pretending blocked sources were searched.

## Data model

Normalized search result:

```ts
type PriceResult = {
  id: string;
  title: string;
  priceArs: number;
  sourceName: string;
  sourceType: "marketplace" | "retailer" | "store";
  listingUrl: string;
  retrievedAt: string;
};
```

Source status:

```ts
type SourceStatus = {
  sourceName: string;
  status: "ok" | "unavailable" | "error" | "rate_limited";
  message?: string;
};
```

## User experience

- The home page shows one free-text query field and submit action.
- Results display in a sortable table or card list with title, ARS price, source name/type, listing link, and retrieved timestamp.
- Prices use Argentina-localized formatting through `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })`.
- Empty state clearly says no comparable prices were found for the submitted query.
- Error and unavailable-source states explain that data may be incomplete and must not be treated as authoritative.

## Validation and boundaries

- Reject empty or whitespace-only queries before calling sources.
- Keep MVP scope to search, result display, ARS formatting, source links, freshness, empty states, and error states.
- Do not add accounts, payments, price history, alerts, browser extensions, or purchasing flows.

## Alternatives considered

- **Plain static React/Vite app only**: rejected because source access would run in the browser, making CORS, credentials, and responsible source policies harder to handle cleanly.
- **Separate React frontend plus Express API**: viable, but rejected for MVP because it adds project structure and process overhead without a clear benefit yet.
- **Scraping-first adapters with browser automation**: rejected because it risks violating source terms, robots policies, and rate limits. The MVP must prefer official or explicitly permitted access and surface unavailable sources instead of bypassing restrictions.

## Open decisions before implementation

- Confirm the first permitted Argentina-relevant source set and available access methods.
- Decide whether shipping cost, installments, discounts, and stock availability remain out of MVP or become explicit fields.
