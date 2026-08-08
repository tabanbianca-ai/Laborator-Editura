# Payment Integration

Payment providers are accessed through adapters.

Architecture:

Store -> Payment Service -> Payment Provider Adapter -> External Payment
Provider.

The browser redirect is not proof of payment completion. Entitlements are
granted only after authoritative payment confirmation, normally through a
verified and idempotent provider webhook.

The platform must not store unnecessary card data.

