# Global Workflow Instructions

This file provides concise global instructions for the multi‑agent workflow used with VS Code and GitHub Copilot.  The goal is to keep this file short so that language models can easily ingest and act upon it.  All specialists defined in the `specialists/` directory should follow these guidelines when performing their tasks.

## General Principles

1. **Keep context small.** Do not dump the entire codebase or lengthy style guides into the prompt.  Provide only the information required for the current task.
2. **Use the right tool for the job.** Each Model Context Protocol (MCP) server is optimised for a specific purpose:
   - **Octocode** – perform semantic search across repositories and store long‑term memories of successful patterns.  It uses Voyage AI embeddings and works best when queries are concise and specific.
   - **PAMPA** – build and query a semantic memory graph of your project by chunking code into functions and automatically tagging them.  Use this for local file context and pattern discovery.
   - **Clear Thought** – apply structured thinking and mental models.  It offers design patterns, debugging strategies, high‑level programming paradigms and systematic problem‑solving methods.
   - **Context7** – fetch up‑to‑date documentation and code examples on demand.  Request documentation only when you need it to reduce token usage.
   - **Playwright MCP** – run or interact with web pages programmatically using Playwright’s accessibility tree.  Use it for deterministic UI testing and browser automation.
3. **Structure instructions using XML.** Each specialist uses an XML document to describe its role, allowed tools, sequence of actions and handoff protocol.  The model should parse only the sections relevant to its role.
4. **Think step by step.** When solving a problem, break it down into smaller steps.  Use Clear Thought for mental models and Pampa/Octocode for retrieving context.  After solving, store learnings via Octocode or Pampa.
5. **Handoff appropriately.** When a specialist finishes its job, it must handoff the work to the next specialist specified in its XML file.  Include any relevant context or partial outputs needed for the next phase.
6. **Reset when necessary.** To maintain a small context window, summarise learnings and store them in the vector databases, then reset the chat before starting a new task.  The next session can retrieve relevant context via Octocode and Pampa.

Specialists should adhere to these guidelines and refer back when uncertain about tool usage or workflow.
