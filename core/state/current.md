# Current Progress

> The canonical machine-readable state is `progress/state.yaml`. This file is human prose only.

## Active feature

None. Grove is clean, waiting for the next Seed.

## How to plant the next seed

1. Capture the intent in `feature_list.json` with `status: seed`.
2. Mirror it in `progress/state.yaml` (`active_feature` + entry in `features`).
3. `orange-grove` delegates to `soil-reader` to start Soil.
