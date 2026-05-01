#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const commands = new Map([
  ["validate", validateCommand],
  ["init", initCommand],
  ["render-prompt", renderPromptCommand],
  ["help", helpCommand]
]);

const [command = "help", ...args] = process.argv.slice(2);

if (!commands.has(command)) {
  fail(`Unknown command: ${command}\n\n${usage()}`);
}

try {
  await commands.get(command)(args);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

async function validateCommand(args) {
  const target = resolve(args[0] ?? ".");
  const errors = [];
  const warnings = [];
  const manifestPath = firstExisting([
    join(target, "workflow", "default.workflow.json"),
    join(target, ".agentic", "workflow.json")
  ]);

  if (!manifestPath) {
    errors.push("Missing workflow manifest: expected workflow/default.workflow.json or .agentic/workflow.json");
  }

  let manifest;
  if (manifestPath) {
    manifest = readJson(manifestPath, errors);
    if (manifest) validateManifest(manifest, manifestPath, errors);
  }

  const specialistsDir = join(target, "specialists");
  if (!existsSync(specialistsDir)) {
    errors.push("Missing specialists/ directory");
  } else if (manifest?.roles) {
    const specialistFiles = new Set(readdirSync(specialistsDir).filter((file) => file.endsWith(".xml")));
    for (const role of manifest.roles) {
      const expected = `${role.id}.xml`;
      if (!specialistFiles.has(expected)) {
        errors.push(`Missing specialist file for role "${role.id}": specialists/${expected}`);
      } else {
        validateSpecialistXml(join(specialistsDir, expected), role, errors);
      }
    }
  }

  const requiredRepoFiles = ["README.md", "instructions.md", "specialists.code-snippets.json"];
  for (const file of requiredRepoFiles) {
    if (!existsSync(join(target, file))) errors.push(`Missing ${file}`);
  }

  validateJsonIfPresent(join(target, "specialists.code-snippets.json"), errors);
  validateJsonIfPresent(join(target, ".vscode", "mcp.json"), errors);

  const templateFiles = [
    "templates/AGENTS.md",
    "templates/.github/copilot-instructions.md",
    "templates/.github/prompts/architect.prompt.md",
    "templates/.github/prompts/implementer.prompt.md",
    "templates/.github/prompts/debugger.prompt.md",
    "templates/.github/prompts/reviewer.prompt.md",
    "templates/.github/prompts/historian.prompt.md",
    "templates/.vscode/mcp.json"
  ];
  for (const file of templateFiles) {
    if (!existsSync(join(target, file))) errors.push(`Missing ${file}`);
  }

  const mcpConfig = join(target, ".vscode", "mcp.json");
  if (existsSync(mcpConfig) && readFileSync(mcpConfig, "utf8").includes("<YOUR_GITHUB_TOKEN>")) {
    warnings.push(".vscode/mcp.json still contains <YOUR_GITHUB_TOKEN>; this is acceptable for the template repo but should be replaced in consuming projects.");
  }

  if (errors.length > 0) {
    console.error("Agentic Workflow validation failed:");
    for (const error of errors) console.error(`- ${error}`);
    if (warnings.length > 0) {
      console.error("\nWarnings:");
      for (const warning of warnings) console.error(`- ${warning}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Agentic Workflow validation passed.");
  if (warnings.length > 0) {
    console.log("Warnings:");
    for (const warning of warnings) console.log(`- ${warning}`);
  }
}

async function initCommand(args) {
  const target = resolve(args[0] ?? ".");
  const force = args.includes("--force");
  const copies = [
    ["workflow/default.workflow.json", ".agentic/workflow.json"],
    ["templates/AGENTS.md", "AGENTS.md"],
    ["templates/.github/copilot-instructions.md", ".github/copilot-instructions.md"],
    ["templates/.github/instructions/tests.instructions.md", ".github/instructions/tests.instructions.md"],
    ["templates/.github/prompts/architect.prompt.md", ".github/prompts/architect.prompt.md"],
    ["templates/.github/prompts/implementer.prompt.md", ".github/prompts/implementer.prompt.md"],
    ["templates/.github/prompts/debugger.prompt.md", ".github/prompts/debugger.prompt.md"],
    ["templates/.github/prompts/reviewer.prompt.md", ".github/prompts/reviewer.prompt.md"],
    ["templates/.github/prompts/historian.prompt.md", ".github/prompts/historian.prompt.md"],
    ["templates/.vscode/mcp.json", ".vscode/mcp.json"]
  ];

  for (const [from, to] of copies) {
    copyFile(join(root, from), join(target, to), { force });
  }

  console.log(`Installed Agentic Workflow files into ${target}`);
}

async function renderPromptCommand(args) {
  const roleId = args[0];
  if (!roleId) fail("Usage: agentic-workflow render-prompt <role-id>");

  const manifest = readJson(join(root, "workflow", "default.workflow.json"), []);
  const role = manifest.roles.find((candidate) => candidate.id === roleId);
  if (!role) fail(`Unknown role "${roleId}". Known roles: ${manifest.roles.map((candidate) => candidate.id).join(", ")}`);

  const phase = manifest.phases.find((candidate) => candidate.role === roleId);
  const gates = manifest.qualityGates.map((gate) => `- ${gate.id}: ${gate.description}`).join("\n");

  console.log(`# ${role.id} agent\n`);
  console.log(`Mission: ${role.mission}\n`);
  console.log(`Allowed work:\n${role.may.map((item) => `- ${item}`).join("\n")}\n`);
  console.log(`Do not:\n${role.mustNot.map((item) => `- ${item}`).join("\n")}\n`);
  if (phase) {
    console.log(`Exit criteria:\n${phase.exitCriteria.map((item) => `- ${item}`).join("\n")}\n`);
  }
  console.log(`Quality gates:\n${gates}\n`);
  console.log(`Handoff target: ${role.handoffTo}`);
}

async function helpCommand() {
  console.log(usage());
}

function usage() {
  return `Agentic Workflow

Commands:
  validate [path]          Validate a workflow repo or installed project
  init [path] [--force]    Install workflow files into another repository
  render-prompt <role>     Print a role prompt from the workflow manifest
  help                     Show this help text`;
}

function validateManifest(manifest, manifestPath, errors) {
  for (const key of ["name", "version", "principles", "roles", "phases", "qualityGates"]) {
    if (!(key in manifest)) errors.push(`${relative(root, manifestPath)} missing required key: ${key}`);
  }

  if (!Array.isArray(manifest.roles) || manifest.roles.length === 0) {
    errors.push("Manifest must define at least one role.");
    return;
  }

  const roleIds = new Set();
  for (const role of manifest.roles) {
    if (!role.id || !/^[a-z][a-z0-9-]*$/.test(role.id)) errors.push(`Invalid role id: ${role.id}`);
    if (roleIds.has(role.id)) errors.push(`Duplicate role id: ${role.id}`);
    roleIds.add(role.id);
    for (const key of ["mission", "may", "mustNot", "handoffTo"]) {
      if (!(key in role)) errors.push(`Role "${role.id}" missing ${key}`);
    }
  }

  for (const role of manifest.roles) {
    if (role.handoffTo && !roleIds.has(role.handoffTo)) {
      errors.push(`Role "${role.id}" handoff target does not exist: ${role.handoffTo}`);
    }
  }

  for (const phase of manifest.phases ?? []) {
    if (!roleIds.has(phase.role)) errors.push(`Phase "${phase.id}" references unknown role: ${phase.role}`);
  }
}

function validateSpecialistXml(filePath, role, errors) {
  const content = readFileSync(filePath, "utf8");
  for (const tag of ["specialist", "role", "description", "tools", "sequence", "handoff"]) {
    if (!content.includes(`<${tag}>`) || !content.includes(`</${tag}>`)) {
      errors.push(`${relative(root, filePath)} is missing <${tag}>`);
    }
  }
  if (!content.toLowerCase().includes(`<handoff>${role.handoffTo}</handoff>`)) {
    errors.push(`${relative(root, filePath)} handoff does not match manifest target "${role.handoffTo}"`);
  }
}

function validateJsonIfPresent(filePath, errors) {
  if (existsSync(filePath)) readJson(filePath, errors);
}

function readJson(filePath, errors) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    errors.push(`${relative(root, filePath)} is not valid JSON: ${error.message}`);
    return undefined;
  }
}

function firstExisting(paths) {
  return paths.find((candidate) => existsSync(candidate));
}

function copyFile(source, destination, { force }) {
  if (!existsSync(source)) fail(`Missing template: ${source}`);
  if (existsSync(destination) && !force) {
    console.log(`Skipped existing ${destination}`);
    return;
  }

  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, readFileSync(source));
  console.log(`Wrote ${destination}`);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

