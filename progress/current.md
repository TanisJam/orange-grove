# Current Progress

> The canonical machine-readable state is `progress/state.yaml`. This file is human prose only.

## Active feature

None. Grove is clean, waiting for the next Seed.

## Harness status

- Phase A (metaphor + roster): complete.
- Phase B (parseable artifacts): complete.
- Phase C (validators): complete.
- Phase D (portability / core + adapters): complete.
- Phase E (delta specs + remote install): complete.
- Phase F (polish: onboarding, example, positioning, tests): complete.
- Phase G (English translation + hard rule rewording): complete.

**Orange Grove v0.3.1 is published.**

## How to plant the next seed

1. Capture the intent in `feature_list.json` with `status: seed`.
2. Mirror it in `progress/state.yaml` (`active_feature` + entry in `features`).
3. `orange-grove` delegates to `soil-reader` to start Soil.

## How to plant a change

1. Identify the base feature (must exist and be `done` or `growing`).
2. Add an entry to `feature_list.json` with `kind: "change"`, `targets: "<base-feature-id>"`, and `id: "<base>/<change-id>"`.
3. Mirror it in `state.yaml`.
4. The flow is identical to a feature; specs live in `specs/active/<base>/changes/<change-id>/`.
