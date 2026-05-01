# Agentic Workflow

Agentic Workflow is a portable operating model for AI-assisted software delivery. It gives Copilot, MCP-enabled IDEs, and command-line coding agents a shared contract for planning, implementation, debugging, review, and durable memory.

The first version of this repo was a set of specialist prompts. This version turns it into a usable kit:

- A versioned workflow manifest: `workflow/default.workflow.json`
- Specialist prompt definitions: `specialists/*.xml`
- Copilot and agent instruction templates: `templates/`
- A dependency-free CLI for validation and installation: `bin/agentic-workflow.mjs`
- CI validation: `.github/workflows/validate.yml`
- Adoption and operating docs: `docs/`

## Why It Matters

Agentic development does not need more vague roleplay. It needs handoffs that survive context resets, reviewers that see evidence, and memory that stores decisions instead of transcripts.

Agentic Workflow is built around five roles:

| Role | Job | Output |
| --- | --- | --- |
| Architect | Shape ambiguous work into a scoped plan | Acceptance criteria, plan, risks |
| Implementer | Make the smallest coherent change | Diff, docs, verification notes |
| Debugger | Prove behavior and isolate failures | Reproduction, root cause, check output |
| Reviewer | Find correctness and maintainability risks | Ordered findings and residual risk |
| Historian | Preserve durable learning | Decisions, outcomes, follow-ups |

Each role has a handoff target and quality gates in the manifest. The workflow is complete only when the next role has enough evidence to continue without replaying the full chat.

## Quick Start

Validate this repository:

```bash
npm test
```

Install the workflow into another repository:

```bash
node ./bin/agentic-workflow.mjs init /path/to/your/repo
```

Validate an installed repository:

```bash
node ./bin/agentic-workflow.mjs validate /path/to/your/repo
```

Render a role prompt from the manifest:

```bash
node ./bin/agentic-workflow.mjs render-prompt architect
```

## What Gets Installed

`init` writes the portable workflow surface into a target repository:

- `.agentic/workflow.json`
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/tests.instructions.md`
- `.github/prompts/architect.prompt.md`
- `.github/prompts/implementer.prompt.md`
- `.github/prompts/debugger.prompt.md`
- `.github/prompts/reviewer.prompt.md`
- `.github/prompts/historian.prompt.md`
- `.vscode/mcp.json`

Use `--force` to overwrite existing files intentionally.

## Repository Layout

```text
.
├── bin/
│   └── agentic-workflow.mjs
├── docs/
│   ├── adoption-guide.md
│   └── operating-model.md
├── examples/
│   └── .agentic/session.md
├── specialists/
│   ├── architect.xml
│   ├── implementer.xml
│   ├── debugger.xml
│   ├── reviewer.xml
│   └── historian.xml
├── templates/
│   ├── AGENTS.md
│   ├── .github/
│   └── .vscode/
└── workflow/
    ├── agentic-workflow.schema.json
    └── default.workflow.json
```

## Current Platform Alignment

As of `2026-04-30T20:41:26-05:00`, current official documentation supports the direction of this repo:

- GitHub Copilot supports repository instructions, path-specific instructions, prompt files, and agent instruction files such as `AGENTS.md`.
- VS Code recommends file-based custom instructions and prompt files over older settings-based generation instructions.
- MCP defines prompts as user-controlled reusable templates and tools as model-controlled external actions with a human approval surface.

Agentic Workflow uses those native surfaces instead of requiring a proprietary runtime.

## MCP Configuration

The repo keeps `.vscode/mcp.json` as a starter configuration. The install template is intentionally minimal:

- Context7 for current documentation lookup.
- Playwright MCP for browser/UI verification.

Add Octocode, PAMPA, Clear Thought, or other MCP servers when your team has a concrete evidence need for them. Keep tokens and credentials outside the repository.

## Documentation

- [Operating Model](docs/operating-model.md)
- [Adoption Guide](docs/adoption-guide.md)
- [Example Session Handoff](examples/.agentic/session.md)

## Development

This project intentionally has no runtime dependencies.

```bash
npm run validate
npm run smoke
npm test
```

## License

Apache-2.0
