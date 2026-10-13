# MVP-02D Dependency Security Review

## Scope

This review records the residual advisory reported for the DOCX import dependency path during MVP-02D validation. It does not suppress or exempt the advisory.

## Dependency Path

The reported moderate advisory is introduced transitively through:

`mammoth -> argparse -> sprintf-js`

The application uses the Mammoth library API to convert uploaded DOCX content. It does not invoke the vulnerable command-line formatting path or pass manuscript content as a format string to `sprintf-js`.

## Remediation Decision

No verified compatible upstream release currently removes this transitive advisory. An unverified override would change Mammoth's resolved dependency contract and is therefore not applied. Critical and high severity audits remain blocking.

The residual risk is retained as a monitored moderate finding. It must be reassessed when Mammoth or Argparse publishes a compatible dependency update. DOCX upload limits, authentication, tenant isolation, file validation, and isolated conversion tests remain in force.
