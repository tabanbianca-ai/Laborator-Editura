# Reconciliation

Reconciliation compares internal distribution state with external provider
state.

Results:

- IN_SYNC
- METADATA_DIVERGED
- STATUS_DIVERGED
- MISSING_EXTERNAL_PRODUCT
- MISSING_INTERNAL_MAPPING
- MANUAL_REVIEW_REQUIRED

Divergence is reported. The system must not silently overwrite canonical
metadata with provider data.

