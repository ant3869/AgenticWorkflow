# Operating Model

Agentic Workflow is a coordination layer for AI coding tools. It does not try to be another agent runtime. Its job is to make agent work observable, repeatable, and portable across Copilot, MCP-enabled IDEs, and command-line agents.

## Why This Exists

Most agentic coding failures are not caused by a missing prompt trick. They come from weak handoffs:

- The planner does not define acceptance criteria.
- The implementer changes scope without saying so.
- The debugger reports confidence without reproduction evidence.
- The reviewer comments on style while missing behavior risk.
- The final summary loses the decision trail.

This project gives those handoffs an explicit shape.

## Core Artifacts

- `workflow/default.workflow.json` is the source of truth for roles, phases, and quality gates.
- `specialists/*.xml` keeps compatibility with prompt-copy workflows.
- `templates/AGENTS.md` gives coding agents a durable repo-local briefing.
- `templates/.github/copilot-instructions.md` and prompt files integrate with GitHub Copilot customization.
- `bin/agentic-workflow.mjs` validates the kit and installs it into another repository.

## Phase Contracts

Each phase has an output contract. A phase is not complete because an agent says it is complete; it is complete when the next phase has enough evidence to continue.

| Phase | Owner | Main output |
| --- | --- | --- |
| Shape | Architect | Acceptance criteria and implementation plan |
| Build | Implementer | Focused diff and verification notes |
| Prove | Debugger | Reproduction, root cause, and check output |
| Review | Reviewer | Ordered findings and residual risks |
| Remember | Historian | Durable decisions and follow-ups |

## Quality Gates

The default workflow uses four gates:

- Scope: a bounded goal and explicit non-goals.
- Context: inspected code and current docs when needed.
- Verification: tests, build, typecheck, or deterministic manual proof.
- Handoff: compact state for the next agent.

Teams can extend these gates in `.agentic/workflow.json`.

## Relationship to MCP

MCP tools and prompts are useful, but they are not a workflow by themselves. The official MCP prompt model exposes reusable prompt templates that users can discover and invoke, while MCP tools let models call external systems with a human approval surface. Agentic Workflow sits above that layer: it decides what evidence a role needs before using tools and what artifact must be handed off afterward.

## Relationship to Copilot Instructions

GitHub and VS Code support repository instruction files, path-specific instructions, prompt files, and agent instruction files. Agentic Workflow ships templates for these native surfaces instead of inventing a proprietary prompt loader.
