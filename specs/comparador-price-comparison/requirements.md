# Requirements — comparador-price-comparison

## Scope

This MVP defines a local app in `comparador/` for Argentina-focused online price comparison. The user enters a product or article query, the app gathers available price results from permitted online sources, and presents comparable results with source context.

## Requirements

## R1
WHEN the user opens the app
THE SYSTEM SHALL provide a way to enter a free-text article or product query.

## R2
WHEN the user submits a non-empty query
THE SYSTEM SHALL search configured Argentina-relevant online sources for matching product listings.

## R3
WHEN price results are available
THE SYSTEM SHALL display each result with product title, price in Argentine pesos (ARS), source name, and a link to the source listing.

## R4
WHEN prices are displayed
THE SYSTEM SHALL format monetary values as Argentina-localized ARS amounts.

## R5
WHEN results come from marketplaces or stores
THE SYSTEM SHALL identify the source clearly enough for the user to distinguish local marketplaces, retailers, or store websites.

## R6
WHEN result data is displayed
THE SYSTEM SHALL show freshness context, such as when the result was retrieved or last updated, so the user can judge whether the price may still be valid.

## R7
WHEN multiple results are available
THE SYSTEM SHALL present them in a comparable format that allows the user to understand price differences across sources.

## R8
WHEN no matching results are found
THE SYSTEM SHALL show an empty-state message that explains no comparable prices were found for the submitted query.

## R9
WHEN a search cannot be completed due to source, network, rate-limit, or parsing failures
THE SYSTEM SHALL show an error state that explains the search could not be completed without falsely presenting incomplete data as authoritative.

## R10
WHEN accessing online sources
THE SYSTEM SHALL use legally and responsibly permitted access methods, preferring official APIs or allowed public pages and respecting source terms, robots policies, and rate limits.

## R11
WHEN a source disallows automated access or requires unavailable authorization
THE SYSTEM SHALL exclude that source from automated retrieval rather than bypassing restrictions.

## R12
WHEN the MVP is delivered
THE SYSTEM SHALL focus on query submission, Argentina-relevant source retrieval, ARS price display, source links, freshness context, empty states, and error states.

## R13
WHEN considering features outside the MVP
THE SYSTEM SHALL NOT require user accounts, payment processing, price history tracking, alerts, browser extensions, or purchasing flows.

## Open Questions

- Which specific Argentina marketplaces and store sources should be included in the first configured source set?
- Should shipping cost, installments, discounts, and stock availability be part of the MVP comparison, or only the visible listed price?
