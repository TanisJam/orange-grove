# Orange Grove — Templates

Canonical shape for every spec and progress artifact. Each agent owns one template:

| Template | Lives in | Owner agent |
| --- | --- | --- |
| `explore.md` | `specs/active/<feature>/explore.md` | `soil-reader` |
| `requirements.md` | `specs/active/<feature>/requirements.md` | `root-gardener` |
| `design.md` | `specs/active/<feature>/design.md` | `trunk-shaper` |
| `tasks.md` | `specs/active/<feature>/tasks.md` | `branch-pruner` |
| `impl.md` | `progress/impl_<feature>.md` | `fruit-grower` |
| `verify.md` | `progress/verify_<feature>.md` | `ripeness-checker` |
| `harvest.md` | `progress/harvest_<feature>.md` | `harvest-inspector` |

These templates are normative. Agents may extend sections but must not drop required ones.
