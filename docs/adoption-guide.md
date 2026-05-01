# Adoption Guide

## Install into a Repository

From this repository:

```bash
node ./bin/agentic-workflow.mjs init /path/to/your/repo
```

Use `--force` only when you intentionally want to overwrite existing workflow files.

The installer writes:

- `.agentic/workflow.json`
- `AGENTS.md`
- `.github/copilot-instructions.md`
- `.github/instructions/tests.instructions.md`
- `.github/prompts/*.prompt.md`
- `.vscode/mcp.json`

## Validate

Run:

```bash
node ./bin/agentic-workflow.mjs validate .
```

In this repository, the same check is available through:

```bash
npm run validate
```

## Customize Roles

Edit `.agentic/workflow.json` in the consuming repository. Keep these invariants:

- Every role has a unique `id`.
- Every `handoffTo` target exists.
- Every phase references an existing role.
- Every quality gate names required evidence.

## Use with Copilot

Use the prompt files from `.github/prompts` when you want a specific phase. Keep `AGENTS.md` and `.github/copilot-instructions.md` short because they are broad instructions that may be applied frequently.

## Use with MCP

Start with the minimal `.vscode/mcp.json` template. Add more servers only when they provide evidence the workflow actually needs. Keep secrets outside the repository and prefer existing authenticated CLIs or local secret stores.

## Team Rollout

1. Install into one active repository.
2. Run one issue through all five phases.
3. Record missing gates or noisy instructions.
4. Tighten `.agentic/workflow.json`.
5. Add CI validation before rolling out to more repositories.
