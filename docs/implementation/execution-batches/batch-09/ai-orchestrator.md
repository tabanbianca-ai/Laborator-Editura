# AI Orchestrator

The AI Orchestrator is the only governed entry point for AI execution.

The AI Orchestrator controls AI execution; the Workflow Engine controls business process.

The orchestrator validates policy, permissions, rights, budget, data classification, kill switches, prompt version, model eligibility, RAG eligibility, and tool authorization before execution.

Agent-to-agent communication must pass through orchestrator contracts. Agents may exchange information and request assistance, but no agent may expand its own access or bypass workflow gates.

