# Agentic Workflow Operating Rules

Use this file as the durable briefing for coding agents working in this repository.

## Workflow

Follow the phase order in `.agentic/workflow.json`:

1. Architect shapes the task and acceptance criteria.
2. Implementer makes the smallest coherent change.
3. Debugger proves the behavior.
4. Reviewer leads with correctness findings.
5. Historian records durable decisions and follow-ups.

## Required Evidence

- Before editing, inspect the relevant files and state the intended change.
- When the task depends on current APIs or package behavior, use official docs and record the source and version.
- After editing code, run the strongest feasible local checks and report exact commands.
- Do not claim success without verification evidence.
- Do not store secrets, tokens, private keys, or raw chat transcripts in memory files.

## Handoff Format

End each phase with:

- `Goal`: one sentence.
- `Changed`: files or none.
- `Evidence`: checks, docs, or manual observations.
- `Risks`: unresolved issues or none.
- `Next`: the next phase or owner.
