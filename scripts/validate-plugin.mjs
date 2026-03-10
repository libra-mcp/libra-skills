#!/usr/bin/env node
/**
 * Validation for libra-skills plugin artifacts.
 * Checks Cursor + Claude manifests, marketplace schema shape, skill/rule frontmatter,
 * and required referenced paths.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function parseFrontmatter(content) {
  if (!content.startsWith("---\n")) return null;
  const end = content.indexOf("\n---\n", 4);
  if (end === -1) return null;
  const block = content.slice(4, end);
  const fields = {};
  for (const line of block.split("\n")) {
    const sep = line.indexOf(":");
    if (sep === -1) continue;
    const key = line.slice(0, sep).trim();
    const value = line.slice(sep + 1).trim();
    fields[key] = value;
  }
  return fields;
}

function validateManifest(manifestPath, label) {
  if (!existsSync(manifestPath)) {
    errors.push(`Missing ${label}`);
    return null;
  }
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  } catch (e) {
    errors.push(`Invalid JSON in ${label}: ${e.message}`);
    return null;
  }
  if (!manifest.name || !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(manifest.name)) {
    errors.push(`${label} "name" must be lowercase kebab-case (alphanumerics, hyphens, periods)`);
  }
  return manifest;
}

const cursorManifest = validateManifest(resolve(root, ".cursor-plugin/plugin.json"), ".cursor-plugin/plugin.json");
const claudeManifest = validateManifest(resolve(root, ".claude-plugin/plugin.json"), ".claude-plugin/plugin.json");

const skillsPath = resolve(root, "skills");
if (existsSync(skillsPath)) {
  const initLibra = resolve(skillsPath, "init-libra/SKILL.md");
  const updateLibra = resolve(skillsPath, "update-libra/SKILL.md");
  for (const p of [initLibra, updateLibra]) {
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      const fm = parseFrontmatter(content);
      if (!fm || !fm.name || !fm.description) {
        errors.push("Skill missing name/description frontmatter: " + p);
      }
    } else {
      errors.push("Missing required skill file: " + p);
    }
  }
}

const rulesPath = resolve(root, "rules");
if (existsSync(rulesPath)) {
  const libraDocs = resolve(rulesPath, "libra-docs.mdc");
  const updateLibraRule = resolve(rulesPath, "update-libra.mdc");
  for (const p of [libraDocs, updateLibraRule]) {
    if (existsSync(p)) {
      const content = readFileSync(p, "utf-8");
      const fm = parseFrontmatter(content);
      if (!fm || !fm.description) {
        errors.push("Rule missing description frontmatter: " + p);
      }
    } else {
      errors.push("Missing required rule file: " + p);
    }
  }
}

for (const manifest of [cursorManifest, claudeManifest]) {
  if (!manifest) continue;
  if (typeof manifest.hooks === "string") {
    const hooksFile = resolve(root, manifest.hooks);
    if (!existsSync(hooksFile)) errors.push("hooks path does not exist: " + manifest.hooks);
  }
}

const hookScript = resolve(root, "scripts/claude-hook-reminder.mjs");
if (!existsSync(hookScript)) {
  errors.push("Missing scripts/claude-hook-reminder.mjs");
}

const marketplacePath = resolve(root, ".claude-plugin/marketplace.json");
if (!existsSync(marketplacePath)) {
  errors.push("Missing .claude-plugin/marketplace.json");
} else {
  try {
    const marketplace = JSON.parse(readFileSync(marketplacePath, "utf-8"));
    if (!marketplace.name) errors.push("marketplace.json missing required field: name");
    if (!Array.isArray(marketplace.plugins)) {
      errors.push("marketplace.json field plugins must be an array");
    } else if (!marketplace.plugins.some((p) => p?.name === "libra-skills")) {
      errors.push('marketplace.json must include plugin entry named "libra-skills"');
    }
  } catch (e) {
    errors.push("Invalid JSON in marketplace.json: " + e.message);
  }
}

if (errors.length > 0) {
  console.error("Validation failed:");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}
console.log("Validation passed.");
