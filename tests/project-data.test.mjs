import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { isSafeProjectUrl, validateProjects } from "../project-data.js";

test("current project data satisfies the navigation contract", async () => {
  const raw = JSON.parse(await readFile(new URL("../projects.json", import.meta.url), "utf8"));
  const result = validateProjects(raw, "https://nav.example/");

  assert.equal(result.errors.length, 0);
  assert.equal(result.projects.length, raw.length);
});

test("validation rejects duplicate IDs, unknown sections, and unsafe URLs", () => {
  const valid = {
    id: "one",
    name: "One",
    url: "https://example.com/",
    tags: [],
    section: "public"
  };
  const result = validateProjects([
    valid,
    { ...valid },
    { ...valid, id: "two", section: "other" },
    { ...valid, id: "three", url: "javascript:alert(1)" },
    { ...valid, id: "four", repo: "data:text/plain,bad" }
  ], "https://nav.example/");

  assert.equal(result.projects.length, 1);
  assert.deepEqual(result.errors.map((error) => error.reason), [
    "id must be unique",
    "section must be public, local, or wip",
    "url must use http or https",
    "repo must use http or https"
  ]);
});

test("safe URL validation accepts web and relative URLs only", () => {
  assert.equal(isSafeProjectUrl("https://example.com"), true);
  assert.equal(isSafeProjectUrl("/projects.json", "https://nav.example/"), true);
  assert.equal(isSafeProjectUrl("javascript:alert(1)"), false);
  assert.equal(isSafeProjectUrl("data:text/plain,bad"), false);
});
