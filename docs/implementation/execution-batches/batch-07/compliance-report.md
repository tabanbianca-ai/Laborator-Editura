# Compliance Report

| Requirement | Status | Evidence |
| --- | --- | --- |
| Distribution and Publication remain distinct | Complete contract | `CanonicalDistribution` references approved publication package |
| Public app has no independent editorial copy | Complete contract | public projection consumes canonical data |
| Channel Registry | Complete contract | `DistributionChannelRegistryEntry` |
| Distribution readiness | Complete contract | `evaluateDistributionReadiness` |
| Public catalog projection | Complete contract | `isVisibleInPublicCatalog` |
| Public API separation | Documented | `public-api.md` |
| Reader progress and annotations | Complete contract | `ReadingProgress`, `ReaderAnnotation` |
| Reader Library through entitlements | Complete contract | `ReaderLibraryEntry`, `Entitlement` |
| Product/Offer/Order separation | Complete contract | `Product`, `Offer`, `Order`, `OrderItem` |
| Payment provider abstraction | Complete contract | adapter and webhook model |
| Webhook idempotency | Complete contract | `PaymentWebhookEvent`, idempotency helper |
| Secure download authorization | Complete contract | `DownloadAuthorization`, entitlement helper |
| Free publication through entitlement | Complete contract | `FREE_PUBLICATION`, `FREE` |
| External mapping and synchronization | Complete contract | `ExternalProductMapping`, `DistributionSyncRecord` |
| Reconciliation | Complete contract | `ReconciliationJob` |
| Withdrawal and superseding | Complete contract | `PublicationWithdrawalRequest`, `PublicationSupersedingRecord` |
| Observability and audit | Complete contract | metrics and audit event names |
| Runtime backup coverage | Complete foundation | Batch 07 runtime tables |
| JSON Master support | Complete additive support | optional Batch 07 arrays |

## Remaining Gaps

- Real payment provider integration is not enabled in this batch.
- Real external distribution adapters are modeled but not provider-connected.
- Public UI implementation remains on existing public portal surfaces unless a
  later batch approves additional frontend work.

