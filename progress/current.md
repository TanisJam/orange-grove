# Current Progress

> The canonical machine-readable state is `progress/state.yaml`. This file is human prose only.

## Active feature

None. Naranjal limpio, esperando la próxima Seed.

## Harness status

- Fase A (metáfora + roster): completa.
- Fase B (artefactos parseables): completa.
- Fase C (validators): completa.
- Fase D (portabilidad / core + adapters): completa.
- Fase E (delta specs + remote install): completa.
- Fase F (polish: onboarding, ejemplo, positioning, tests): completa.

**Orange Grove v0.3.0 is ready to push to GitHub.**

## How to plant the next seed

1. Capturá la intención en `feature_list.json` con `status: seed`.
2. Reflejala en `progress/state.yaml` (`active_feature` + entrada en `features`).
3. `orange-grove` delega a `soil-reader` para arrancar Soil.

## How to plant a change

1. Identificá la feature base (debe existir y estar `done` o `growing`).
2. Agregá en `feature_list.json` una entrada con `kind: "change"`, `targets: "<base-feature-id>"`, e `id: "<base>/<change-id>"`.
3. Reflejala en `state.yaml`.
4. El flujo es idéntico al de feature; los specs viven en `specs/active/<base>/changes/<change-id>/`.
