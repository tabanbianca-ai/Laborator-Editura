# Distribution Connectors

Provider-specific behavior is implemented through adapters behind the canonical
Distribution Connector contract.

Required adapter operations:

- validatePublication()
- validateMetadata()
- submit()
- updateMetadata()
- queryStatus()
- withdraw()
- reconcile()

Editorial logic is not allowed inside adapters. External providers do not
become canonical sources.

