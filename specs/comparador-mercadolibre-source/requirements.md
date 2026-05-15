# Requirements — comparador-mercadolibre-source

## Scope

Add Mercado Libre Argentina as a real, permitted source for the existing `comparador/` price comparison app. The source must use Mercado Libre's official API access for Argentina (`SITE_ID` `MLA`) and must not use scraping or fabricated data.

## Requirements

## R1
WHEN the app lists or executes configured price sources
THE SYSTEM SHALL include Mercado Libre Argentina as an available real source only when its required access configuration is valid.

## R2
WHEN the user submits a non-empty search query and Mercado Libre Argentina is available
THE SYSTEM SHALL query Mercado Libre's official item search API for Argentina using `SITE_ID` `MLA`.

## R3
WHEN accessing Mercado Libre data
THE SYSTEM SHALL use permitted official API access and SHALL NOT scrape Mercado Libre web pages, bypass access controls, or use undocumented endpoints as the primary retrieval path.

## R4
WHEN Mercado Libre API access requires an access token
THE SYSTEM SHALL read the token from secure runtime configuration rather than hard-coding it, committing it, exposing it to the browser, or logging it.

## R5
WHEN the Mercado Libre source returns listings
THE SYSTEM SHALL normalize each usable listing into the app's existing comparable price result shape with title, numeric price, currency, source name, source listing link, and retrieval freshness context.

## R6
WHEN a Mercado Libre listing has a currency other than Argentine pesos (`ARS`)
THE SYSTEM SHALL exclude it from comparable ARS price results or mark it unavailable for comparison without converting currency implicitly.

## R7
WHEN a Mercado Libre result is displayed
THE SYSTEM SHALL link to the listing permalink supplied by Mercado Libre so the user can inspect the source listing directly.

## R8
WHEN Mercado Libre results are displayed
THE SYSTEM SHALL show freshness context indicating that the data was retrieved from Mercado Libre for the current search session.

## R9
WHEN querying Mercado Libre
THE SYSTEM SHALL apply bounded search limits so the app requests and displays a reasonable number of results instead of unbounded result sets.

## R10
WHEN Mercado Libre indicates rate limiting, including HTTP `429`
THE SYSTEM SHALL stop treating the source as successful for that request and show a rate-limit-aware unavailable/error state without retrying aggressively.

## R11
WHEN Mercado Libre returns authorization or access failures, including HTTP `401` or `403`
THE SYSTEM SHALL show that Mercado Libre is unavailable due to configuration or access authorization and SHALL NOT fall back to fake Mercado Libre results.

## R12
WHEN the Mercado Libre request fails due to network, timeout, malformed response, or other source errors
THE SYSTEM SHALL report the source failure clearly while preserving any valid results from other configured sources.

## R13
WHEN Mercado Libre returns no matching listings for the submitted query
THE SYSTEM SHALL show a no-results state for Mercado Libre without presenting demo/local data as Mercado Libre data.

## R14
WHEN Mercado Libre data is incomplete, missing a price, missing a permalink, or otherwise cannot be safely normalized
THE SYSTEM SHALL exclude that listing from comparable results or mark it unavailable rather than displaying misleading partial data.

## R15
WHEN Mercado Libre source behavior is verified
THE SYSTEM SHALL have tests or documented verification covering successful normalization, token/configuration absence, `401`, `403`, `429`, network failure, no-results behavior, ARS currency guarding, and the no-fake-data constraint.

## Open Questions

- Which Mercado Libre credential flow or token provisioning method will be used for local development and deployment?
- What exact maximum result count should the Mercado Libre source request and display per query?
