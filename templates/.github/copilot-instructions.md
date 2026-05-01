# Repository Instructions for GitHub Copilot

This repository uses Agentic Workflow. Keep changes small, evidence-backed, and easy for the next agent to continue.

- Start by identifying the current workflow phase: architect, implementer, debugger, reviewer, or historian.
- Prefer repository patterns over new abstractions.
- Ask only blocking questions; otherwise make a conservative assumption and document it.
- Use official docs for current library or platform behavior.
- When writing code, update tests and documentation for the impacted behavior.
- When reviewing, lead with bugs, risks, regressions, and missing tests before style comments.
- Never invent tool results, test output, file contents, or links.
- Never include secrets in examples, logs, memory, or documentation.
