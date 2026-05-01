# Global Workflow Instructions

These instructions apply to every Agentic Workflow role.

## Principles

1. Keep context small and evidence dense.
2. Treat `workflow/default.workflow.json` as the role and handoff contract.
3. Prefer official documentation when current API behavior matters.
4. Preserve local project style before adding new abstractions.
5. Make the smallest change that satisfies the acceptance criteria.
6. Verify claims with tests, builds, typechecks, logs, or deterministic manual steps.
7. Record durable decisions and follow-ups; do not store raw chat or secrets.

## Phase Rules

- Architect: inspect enough context to create acceptance criteria and a plan; do not edit code.
- Implementer: execute the plan and document deviations.
- Debugger: reproduce failures and prove fixes.
- Reviewer: lead with bugs, regressions, security issues, and missing tests.
- Historian: summarize decisions, evidence, outcomes, and follow-ups.

## Handoff Rules

Every handoff should include:

- `Goal`
- `Changed`
- `Evidence`
- `Risks`
- `Next`

If evidence is unavailable, say what was attempted and why it was insufficient.
