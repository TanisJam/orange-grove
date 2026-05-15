# Orange SDD / Naranja SDD

Este repo es el laboratorio local del harness **Orange SDD / Naranja SDD** para opencode.

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

## Skill local

- `orange-sdd`: contiene el proceso reutilizable, la metáfora cítrica y las reglas SDD.

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
| `specs/<feature>/explore.md` | Soil notes (contexto del repo). |
| `specs/<feature>/requirements.md` | Roots. |
| `specs/<feature>/design.md` | Trunk. |
| `specs/<feature>/tasks.md` | Branches. |
| `progress/current.md` | Estado vivo de la sesión. |
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
