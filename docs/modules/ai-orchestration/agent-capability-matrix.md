# Canonical Agent Handler Matrix

All identities come from GAP-02.1. Implemented means a tested local handler exists;
it does not mean that any tenant has activated the agent. No activation is automatic.

| Identity | Handler | Resource / permission | Implementation |
| --- | --- | --- | --- |
| coordinator-agent | coordinator.plan.v1 | PROJECT / project.read | Advisory stage/dependency plan |
| projects-agent | projects.readiness.v1 | PROJECT / project.read | Readiness/completeness report |
| manuscripts-agent | manuscripts.integrity.v1 | MANUSCRIPT / document.read | Structure and version integrity |
| documentation-agent | documentation.citations.v1 | LINGUISTIC_SOURCE / project.read | Citation and authorized reference metadata |
| translation-agent | translation.proposal.v1 | DOCUMENT + segmentId / document.read | Paid execution disabled pending atomic financial reservations |
| review-agent | None | Not available | No runtime review binding |
| layout-agent | None | Not available | No runtime layout binding |
| publishing-agent | None | Not available | No runtime publishing binding |
| distribution-agent | None | Not available | No runtime distribution binding |
| library-agent | None | Not available | No runtime library binding |
| rights-provenance-agent | None | Not available | No runtime rights binding |
| illustration-agent | None | Not available | No runtime illustration binding |
| audio-agent | None | Not available | No runtime audio binding |
| video-agent | None | Not available | No runtime video binding |
| magazine-agent | None | Not available | No runtime magazine binding |
| administration-agent | None | Not available | No runtime administration binding |
| evolution-agent | None | Not available | No runtime evolution binding |
| quality-agent | quality.metadata.v1 | DOCUMENT / document.read | Existing title/language validator preserved |
| terminology-lexicography-subagent | terminology.analyze.v1 | DOCUMENT + segmentId / document.read | Local glossary conflict and approved TM analysis; parent Translation |
| semantic-fidelity-subagent | semantic.analyze.v1 | DOCUMENT + segmentId / document.read | Local semantic findings; parent Translation |
| editorial-decision-subagent | None | Not available | Parent: Review |
| planning-coordination-subagent | planning.dependencies.v1 | PROJECT / project.read | Scheduling/dependency report; parent Coordinator |
| media-localization-subagent | None | Not available | Parents: Audio and Video |
| platform-engineering-subagent | None | Not available | Parent: Evolution |

For each implemented handler, capability and operation IDs are the handler ID
without `.v1`; schema references append `.input.v1` and `.output.v1` to the capability.
Quality preserves operation `quality.validate-metadata`, capability `quality.metadata`,
and its existing schema references. Domain permissions and Need-to-Know are always
additional to the table's minimum canonical permission.

See [Local Handler Contract](local-handler-contract.md) for schemas, provenance,
workflow rules, bounded execution, authorization, and operational limitations.
The [linguistic contract](linguistic-handler-contract.md) defines the added segment
authorization and paid-execution prohibition. Nine descriptors do not mean nine
executable handlers: only eight have validated local execution paths.
