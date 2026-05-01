# Contributing

Agentic Workflow accepts contributions that make agentic software work more observable, repeatable, and portable.

## Good Contributions

- New workflow roles with clear output contracts.
- Better quality gates with concrete evidence requirements.
- Templates for additional agent surfaces, as long as they do not require a proprietary runtime.
- Validator improvements that catch broken handoffs, stale docs, or unsafe instructions.
- Real session examples that remove secrets and raw transcript content.

## Pull Request Checklist

- Run `node ./bin/agentic-workflow.mjs validate .`.
- Run `node ./bin/agentic-workflow.mjs render-prompt architect`.
- Update docs for changed workflow behavior.
- Keep templates short enough to be reused as broad instructions.
- Do not commit tokens, private repository names, private chat logs, or proprietary customer details.

## Design Bar

Prefer artifacts that can be checked by machines. A stronger prompt is useful; a stronger prompt plus a validator is better.
