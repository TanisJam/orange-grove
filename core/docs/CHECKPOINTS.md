# Orange Grove — Checkpoints

Una feature solo puede considerarse lista cuando cumple todos estos puntos:

## Specs

- [ ] Hay una entrada en `feature_list.json`.
- [ ] Existe `specs/active/<feature>/explore.md` (Soil).
- [ ] Existe `specs/active/<feature>/requirements.md` (Roots) con requirements numerados.
- [ ] Existe `specs/active/<feature>/design.md` (Trunk) con decision, alternative considered y test strategy.
- [ ] Existe `specs/active/<feature>/tasks.md` (Branches) con tasks chequeables referenciando `Rn`.

## Implementación

- [ ] La implementación sigue las tasks aprobadas.
- [ ] Cada task marcada `[x]` está reflejada en el código o docs.
- [ ] `progress/impl_<feature>.md` registra archivos tocados y notas de verificación.

## Ripening (mecánico)

- [ ] Existe `progress/verify_<feature>.md` con veredicto `RIPE`.
- [ ] Cada `Rn` está cubierto por al menos una task y una evidencia (test o verificación).
- [ ] Si `design.md` exige tests, los tests existen.
- [ ] Si los tests son ejecutables en el repo, pasan.

## Harvest (humano)

- [ ] Existe `progress/harvest_<feature>.md` con veredicto `PASS`.
- [ ] `harvest-inspector` no editó código.
- [ ] `progress/current.md` refleja el estado real.
- [ ] `progress/history.md` contiene un resumen append-only al cerrar la feature.

## Archive (opcional, fase posterior)

- [ ] Carpeta movida desde `specs/active/<feature>/` a `specs/archive/<feature>/` cuando el estado pasa a `archived`.
- [ ] `progress/state.yaml` refleja el cambio de status.
