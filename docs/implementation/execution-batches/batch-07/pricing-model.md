# Pricing Model

Pricing is represented through offers, not immutable publication fields.

An offer stores:

- product
- territory
- currency
- price
- tax behavior
- validity interval
- discount policy
- status

The server recalculates applicable price, currency, discounts, and tax before
payment. Client-side price changes are ignored.

