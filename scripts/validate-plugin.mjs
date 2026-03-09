#!/usr/bin/env node
/**
 * Minimal validation for single-plugin repo (libra-skills).
 * Checks: plugin.json at root, frontmatter on skills (name, description), referenced paths exist.
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

const manifestPath = resolve(root, ".cursor-plugin/plugin.json");
if (!existsSync(manifestPath)) {
  errors.push("Missing .cursor-plugin/plugin.json");
} else {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  } catch (e) {
    errors.push("Invalid JSON in plugin.json: " + e.message);
  }
  if (manifest) {
    if (!manifest.name || !/^[a-z0-9]([a-z0-9.-]*[a-z0-9])?$/.test(manifest.name)) {
      errors.push('plugin.json "name" must be lowercase kebab-case (alphanumerics, hyphens, periods)');
    }
    const skillsPath = manifest.skills ? resolve(root, manifest.skills) : resolve(root, "skills");
    if (existsSync(skillsPath)) {
      const initLibra = resolve(skillsPath, "init-libra/SKILL.md");
      const libraUpdate = resolve(skillsPath, "libra-update/SKILL.md");
      for (const p of [initLibra, libraUpdate]) {
        if (existsSync(p)) {
          const content = readFileSync(p, "utf-8");
          const fm = parseFrontmatter(content);
          if (!fm || !fm.name || !fm.description) {
            errors.push("Skill missing name/description frontmatter: " + p);
          }
        }
      }
    }
    const hooksPath = manifest.hooks;
    if (typeof hooksPath === "string") {
      const hooksFile = resolve(root, hooksPath);
      if (!existsSync(hooksFile)) errors.push("hooks path does not exist: " + hooksPath);
    }
  }
}

if (errors.length > 0) {
  console.error("Validation failed:");
  errors.forEach((e) => console.error(" -", e));
  process.exit(1);
}
console.log("Validation passed.");
