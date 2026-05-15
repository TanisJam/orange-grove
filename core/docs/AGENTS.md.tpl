# Orange Grove

Este repo usa el harness **Orange Grove** — Spec Driven Development con metáfora cítrica.

La idea central: no se cosecha fruta sin raíces, y no se cosecha fruta sin madurar. Antes de implementar, exploramos, hacemos crecer requirements, diseñamos el tronco y podamos tasks. Antes de aprobar como humano, verificamos mecánicamente.

## Agentes locales

| Agente | Rol |
| --- | --- |
| `orange-grove` | Orquestador / leader. Cuida el naranjal completo y no implementa código directamente. |
| `soil-reader` | Explora el repo y produce `explore.md` antes de cualquier spec. |
| `root-gardener` | Requirements / spec author. Hace crecer las raíces antes de cualquier código. |
| `trunk-shaper` | Diseño técnico. Da forma al tronco. |
| `branch-pruner` | Task planner. Poda las ramas ejecutables. |
| `fruit-grower` | Implementer. Hace crecer la fruta siguiendo tasks aprobadas, una por vez. |
| `ripeness-checker` | Verificación mecánica contra spec. No edita código. |
| `harvest-inspector` | Review humano + archive. No edita código. |

## Validators

Pure-Node scripts en `validator/` que enforzan reglas mecánicas:

- `validator/check-traceability.mjs` — cada `Rn` cubierto por ≥1 task; sin refs huérfanas.
- `validator/check-spec-shape.mjs` — secciones requeridas por template.
- `validator/doctor.mjs` — health del harness (state.yaml ↔ feature_list ↔ folders ↔ agents).

`ripeness-checker` los corre como parte del veredicto. `orange-grove` corre `doctor` al inicio de sesión.

## Skill local

- `orange-grove`: contiene el proceso reutilizable, la metáfora cítrica y las reglas SDD.

## Flujo

1. **Plant the Seed** — capturar la intención en `feature_list.json`.
2. **Read the Soil** — `soil-reader` escribe `specs/<feature>/explore.md`.
3. **Grow the Roots** — `root-gardener` escribe `specs/<feature>/requirements.md`.
4. **Shape the Trunk** — `trunk-shaper` escribe `specs/<feature>/design.md`.
5. **Prune the Branches** — `branch-pruner` escribe `specs/<feature>/tasks.md`.
6. **Grow the Fruit** — `fruit-grower` implementa siguiendo tasks aprobadas.
7. **Check Ripeness** — `ripeness-checker` valida mecánicamente (Rn → Tn → evidencia).
8. **Harvest** — `harvest-inspector` revisa calidad y archiva.

## Estado en disco

| Archivo | Uso |
| --- | --- |
| `feature_list.json` | Lista de features y estado actual. |
| `progress/state.yaml` | Estado parseable (canónico para máquina). |
| `specs/active/<feature>/explore.md` | Soil notes (contexto del repo). |
| `specs/active/<feature>/requirements.md` | Roots. |
| `specs/active/<feature>/design.md` | Trunk. |
| `specs/active/<feature>/tasks.md` | Branches. |
| `specs/archive/<feature>/` | Features cerradas y archivadas. |
| `templates/` | Shapes canónicos de cada artefacto. |
| `progress/current.md` | Estado vivo de la sesión (prosa humana). |
| `progress/impl_<feature>.md` | Notas del implementer. |
| `progress/verify_<feature>.md` | Resultado de Ripening. |
| `progress/harvest_<feature>.md` | Resultado de Harvest. |
| `progress/history.md` | Bitácora append-only. |
| `CHECKPOINTS.md` | Criterios para considerar una feature lista. |

## Reglas duras

- El líder coordina, no implementa.
- Soil antes de Roots. Roots antes de Trunk. Trunk antes de Branches. Branches antes de Fruit.
- Fruit antes de Ripening. Ripening antes de Harvest.
- Sin Ripening verde no hay review humano.
- CONCEPTOS ANTES DE CÓDIGO.
