# Multi‑Agent Workflow for VS Code & GitHub Copilot

This repository contains all the configuration files and instructions you need to implement a multi‑agent coding workflow using GitHub Copilot Chat and several Model Context Protocol (MCP) servers.  The design is inspired by a community workflow that divides tasks into specialists (architect, implementer, debugger, reviewer and historian) and uses vector databases and mental models to improve code generation and reliability.

## Overview

The workflow is built around the following components:

* **MCP servers** – external services that extend Copilot Chat with context retrieval, semantic search, structured thinking, documentation access and UI automation.  These are configured in `.vscode/mcp.json`.
* **Specialist definitions** – XML files in the `specialists/` folder that describe the role, tools, sequence of actions and handoff for each specialist.  Copilot Chat uses these definitions to understand what each agent should do.
* **Global instructions** – the `instructions.md` file contains general guidelines for tool usage, context management and handoff protocols.  It is intentionally short so that it fits within a large‑language‑model context window.
* **Your project codebase** – the actual application code you want to work on.  This setup does not include your project files; you should open a project in VS Code and copy these configuration files into the root.

## Installing MCP servers

1. Make sure you have Node 18+ installed.
2. Obtain any necessary API keys:
   * **GitHub PAT** – required by Octocode to access private repositories.
   * **Voyage AI API key** – optional; Octocode defaults to Voyage’s 200 million free embedding tokens per account.
3. Copy the `.vscode/mcp.json` file into the root of your project.  This file declares the MCP servers used by the workflow:

```json
{
  "mcp": {
    "servers": {
      "octocode": {
        "command": "npx",
        "args": ["octocode-mcp"],
        "env": {
          "GITHUB_TOKEN": "<YOUR_GITHUB_TOKEN>"
        }
      },
      "pampa": {
        "command": "npx",
        "args": ["-y", "pampa", "mcp"]
      },
      "clear-thought": {
        "command": "npx",
        "args": ["@chirag127/clear-thought-mcp-server"]
      },
      "context7": {
        "type": "http",
        "url": "https://mcp.context7.com/mcp"
      },
      "playwright": {
        "command": "npx",
        "args": ["@playwright/mcp@latest"]
      }
    }
  }
}
```

Edit the `<YOUR_GITHUB_TOKEN>` placeholder with a valid token or remove the `env` entry if you rely on the `gh` CLI for authentication.  After saving, reload VS Code to launch the servers automatically.

## Indexing your project

Before using the workflow, index your codebase so that Octocode and PAMPA can answer semantic queries:

1. Open a terminal in your project and run:

   ```bash
   npx octocode-mcp index
   ```

   This step downloads your repository metadata and stores embeddings.  If Octocode prompts for authentication, provide your GitHub token.

2. Run the PAMPA indexing command:

   ```bash
   npx pampa mcp index_project
   ```

   PAMPA will scan your files, split them into meaningful chunks, assign semantic tags and build a local index in `pampa.db`.  You only need to do this when the project changes significantly.

## Creating specialist prompts

Each specialist is defined in an XML file under `specialists/`.  You can load a specialist by copying its contents into Copilot Chat or by creating a snippet that inserts the XML when you type a slash command (e.g. `/architect`).  The key fields are:

| File | Role | Purpose | Primary tools | Handoff |
|------|------|---------|--------------|---------|
| `architect.xml` | Architect | Understand the feature request, search for relevant context and produce a plan | octocode, pampa, clear‑thought, context7 | implementer |
| `implementer.xml` | Implementer | Generate code from the plan using examples and documentation | octocode, pampa, context7, clear‑thought | debugger |
| `debugger.xml` | Debugger | Run tests and fix bugs using Playwright and debugging strategies | playwright, clear‑thought, octocode, pampa | reviewer |
| `reviewer.xml` | Reviewer | Check code quality and adherence to patterns | octocode, pampa, clear‑thought | historian |
| `historian.xml` | Historian | Summarise the session and store learnings | octocode, pampa, clear‑thought | architect |

To use a specialist, paste its XML into Copilot Chat along with your natural‑language request.  The specialist’s `<sequence>` defines the steps the model should follow, and the `<handoff>` indicates which specialist should be invoked next.

## Running through the workflow

1. **Start with the Architect.** Provide a short description of the feature you want to build, then insert the contents of `architect.xml`.  Copilot Chat will call Octocode and PAMPA to gather context, process it through Clear Thought, and return a high‑level plan.

2. **Invoke the Implementer.** When you receive the plan, clear the chat context (to keep tokens low) and then paste the plan along with `implementer.xml`.  Copilot will generate code using Octocode and PAMPA for context and call Context7 when documentation is needed.  It should produce commit‑ready code.

3. **Debug.** Insert `debugger.xml` to run tests or interact with the UI via Playwright.  Copilot will identify and fix bugs using Clear Thought’s debugging strategies and additional context from Octocode/PAMPA.

4. **Review.** Paste `reviewer.xml` to request a final code review.  Copilot will compare your changes with existing patterns and suggest improvements.

5. **Summarise.** Use `historian.xml` to summarise what worked and what didn’t.  It will store this information via Octocode and PAMPA for future use.  After this, clear the chat context; the next session can query the stored memories.

6. **Iterate.** Repeat the process for new features or tasks.  As your vector databases accumulate more context, the AI’s performance should improve.

## Tips

* Keep your prompts lean—avoid multi‑page descriptions or large snippets of code.  Provide just enough information for the specialist to act.
* Use Context7 sparingly.  Each call adds tokens.  Only request documentation when the model is uncertain about a library or API.
* Store common mistakes and patterns in Octocode and PAMPA.  Retrieval helps the model avoid repeating old errors.
* Reset the chat context regularly.  Once a specialist finishes, summarise and start a new chat so you don’t exceed the context window.

This repository provides a blueprint for building an effective multi‑agent workflow with GitHub Copilot Chat.  Feel free to refine the specialists, add new tools and modify the sequence to suit your project’s needs.
