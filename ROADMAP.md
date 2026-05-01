# Roadmap

## 0.1: Portable Workflow Kit

- Versioned workflow manifest.
- Role prompt rendering.
- Project installer.
- Repository validator.
- Copilot, AGENTS.md, and MCP starter templates.

## 0.2: Stronger Validation

- Validate prompt frontmatter.
- Validate installed `.agentic/workflow.json` against the JSON schema.
- Check that docs mention every role and quality gate.
- Add golden tests for rendered prompts.

## 0.3: Runtime-Agnostic Session State

- Add a `.agentic/session.json` format for live handoffs.
- Add `start`, `handoff`, and `complete` CLI commands.
- Support exporting session state to Markdown for code review.

## 0.4: MCP Prompt Server

- Expose workflow roles as MCP prompts.
- Surface quality gates as reusable checklist prompts.
- Keep tool execution outside the server; this project should coordinate evidence, not own credentials.

## 1.0: Stable Agentic Workflow Specification

- Stabilize manifest schema.
- Publish compatibility tests.
- Document migration policy.
- Collect real-world workflow examples from multiple project types.
