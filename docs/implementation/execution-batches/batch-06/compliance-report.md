# Compliance Report

| Requirement | Status | Evidence |
| --- | --- | --- |
| Canonical publication source snapshot | Complete contract | `PublicationSourceSnapshot` |
| No second source of truth | Complete contract | `derivedOutputsCanBecomeMaster: false` |
| Publication build model | Complete contract | `PublicationBuild` |
| Layout and typography profiles | Complete contract | `LayoutProfile`, `TypographyProfile` |
| Font registry and embedding rules | Complete contract | `FontRegistryEntry`, `fontAllowsEmbedding` |
| PDF digital and print support | Complete contract | `PublicationOutputFormat` |
| EPUB 3 from semantic master | Complete contract | `epubGeneratedFromSemanticMaster: true` |
| HTML generation support | Complete contract | `htmlGeneratedFromSemanticMaster: true` |
| Image and cover models | Complete contract | `ImagePublicationAsset`, `CoverModel` |
| Manifests | Complete contract | Publication, Rights, Accessibility, Integrity manifests |
| Canonical Publication Package | Complete contract | `PublicationPackage` |
| Validation pipeline | Complete contract | stages and severities |
| Human publication approval | Complete contract | `PublicationApproval` |
| Regeneration and OUTDATED detection | Complete contract | dependency fingerprint helpers |
| Build queue and idempotency | Complete contract | `PublicationBuildJob`, idempotency helper |
| Unified Library linking | Complete contract | `libraryPublicationId` |
| Runtime backup coverage | Complete foundation | publishing runtime tables |
| JSON Master support | Complete additive support | optional Batch 06 arrays |

## Remaining Gaps

- Real PDF, EPUB, HTML, and print rendering engines are not implemented in this
  batch.
- External distribution providers remain out of scope.
- End-to-end visual output validation is reserved for implementation batches
  that introduce real renderers.

