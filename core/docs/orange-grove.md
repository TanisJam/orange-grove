# Orange Grove

Orange Grove es una adaptación personal de Spec Driven Development para trabajar con agentes reutilizables.

## Metáfora

| SDD | Orange Grove | Resultado |
| --- | --- | --- |
| Idea | Seed | Cambio identificado |
| Exploración | Soil | Contexto del repo entendido y documentado |
| Requirements | Roots | Qué debe pasar |
| Design | Trunk | Cómo se sostiene técnicamente |
| Tasks | Branches | Pasos ejecutables |
| Implementation | Fruit | Código |
| Verification | Ripening | ¿Está madura la fruta? (mecánico) |
| Review | Harvest | Cosecha humana y archivado |

## Agentes

| Agente | Rol |
| --- | --- |
| `orange-grove` | Orquestador / leader |
| `soil-reader` | Exploración del repo |
| `root-gardener` | Requirements / spec author |
| `trunk-shaper` | Diseño técnico |
| `branch-pruner` | Task planner |
| `fruit-grower` | Implementer |
| `ripeness-checker` | Verificación mecánica |
| `harvest-inspector` | Review humano + archive |

## Reglas principales

- No se implementa fruta sin raíces aprobadas.
- No se cosecha fruta sin madurar (Ripening verde antes que Harvest).
- Ripeness y Harvest no editan código.

## Archivos por feature

Cada feature activa vive en:

```txt
specs/active/<feature>/
├── explore.md
├── requirements.md
├── design.md
└── tasks.md
```

Con progreso y verificación en:

```txt
progress/
├── state.yaml              ← canónico
├── current.md              ← prosa humana
├── history.md
├── impl_<feature>.md
├── verify_<feature>.md
└── harvest_<feature>.md
```

Features cerradas se mueven a `specs/archive/<feature>/`.

Templates canónicos en `templates/` (uno por artefacto).

## Estados

- `seed`: idea registrada.
- `exploring`: soil-reader trabajando.
- `rooting`: requirements en preparación.
- `shaping`: design en preparación.
- `pruning`: tasks en preparación.
- `spec_ready`: explore + requirements + design + tasks listos, esperando aprobación humana.
- `growing`: implementación en curso.
- `ripening`: verificación mecánica en curso.
- `harvest_ready`: ripeness PASS, listo para review humano.
- `done`: harvest PASS, listo para archivar.
- `archived`: movido a `specs/archive/<feature>/`.
