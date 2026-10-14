import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { isSafeIconPath, isSafeProjectUrl, validateProjects } from "../project-data.js";

async function currentProjects() {
  return JSON.parse(await readFile(new URL("../projects.json", import.meta.url), "utf8"));
}

test("current project data satisfies the gallery contract", async () => {
  const raw = await currentProjects();
  const result = validateProjects(raw, "https://nav.example/");

  assert.equal(result.errors.length, 0);
  assert.equal(result.projects.length, 19);
  assert.deepEqual(
    Object.fromEntries(["public", "local", "wip"].map(section => [
      section,
      result.projects.filter(project => project.section === section).length
    ])),
    { public: 13, local: 4, wip: 2 }
  );
  assert.equal(result.projects.filter(project => project.featured).length, 5);
});

test("Campus Shuttle Board is featured and paigu-bot is not published", async () => {
  const raw = await currentProjects();
  const shuttle = raw.find(project => project.id === "campus-shuttle-board");

  assert.ok(shuttle);
  assert.equal(shuttle.url, "https://bitbus.nslc.top");
  assert.equal(shuttle.featured, true);
  assert.equal(shuttle.icon, "assets/icons/source/bitbus.png");
  assert.equal(raw.some(project => project.id.includes("paigu")), false);
});

test("validation rejects duplicate IDs, unknown sections, unsafe URLs, and remote icons", () => {
  const valid = {
    id: "one",
    name: "One",
    desc: "One project",
    coverLabel: "工具",
    url: "https://example.com/",
    icon: "assets/icons/custom/one.svg",
    tags: [],
    kind: "tool",
    section: "public"
  };
  const result = validateProjects([
    valid,
    { ...valid },
    { ...valid, id: "two", section: "other" },
    { ...valid, id: "three", url: "javascript:alert(1)" },
    { ...valid, id: "four", repo: "data:text/plain,bad" },
    { ...valid, id: "five", icon: "https://example.com/icon.svg" }
  ], "https://nav.example/");

  assert.equal(result.projects.length, 1);
  assert.deepEqual(result.errors.map(error => error.reason), [
    "id must be unique",
    "section must be public, local, or wip",
    "url must use http or https",
    "repo must use http or https",
    "icon must be a local project icon asset"
  ]);
});

test("safe URL and icon validation are intentionally narrow", () => {
  assert.equal(isSafeProjectUrl("https://example.com"), true);
  assert.equal(isSafeProjectUrl("/projects.json", "https://nav.example/"), true);
  assert.equal(isSafeProjectUrl("javascript:alert(1)"), false);
  assert.equal(isSafeIconPath("assets/icons/custom/project.svg"), true);
  assert.equal(isSafeIconPath("assets/icons/source/project.png"), true);
  assert.equal(isSafeIconPath("../project.svg"), false);
});

test("dates and removed routes field are validated", () => {
  const base = {
    id: "dated",
    name: "Dated",
    desc: "A dated project",
    coverLabel: "日期",
    url: "https://example.com/",
    icon: "assets/icons/custom/dated.svg",
    tags: [],
    kind: "tool",
    section: "public"
  };
  const result = validateProjects([
    { ...base, updated: "2026/09/30" },
    { ...base, id: "routes", routes: [] }
  ], "https://nav.example/");

  assert.deepEqual(result.errors.map(error => error.reason), [
    "updated must use YYYY-MM-DD",
    "routes is no longer supported"
  ]);
});

test("every declared project icon exists in the repository", async () => {
  const raw = await currentProjects();
  for (const project of raw) {
    await access(new URL("../" + project.icon, import.meta.url));
  }
});

test("every project has a concise semantic cover label", async () => {
  const raw = await currentProjects();
  assert.ok(raw.every(project => typeof project.coverLabel === "string" && project.coverLabel.length <= 8));
  assert.equal(raw.find(project => project.id === "campus-shuttle-board").coverLabel, "班车");
});

test("deep-search and route artifacts are absent", async () => {
  const [projects, script, html, headers] = await Promise.all([
    readFile(new URL("../projects.json", import.meta.url), "utf8"),
    readFile(new URL("../script.js", import.meta.url), "utf8"),
    readFile(new URL("../index.html", import.meta.url), "utf8"),
    readFile(new URL("../_headers", import.meta.url), "utf8")
  ]);

  assert.doesNotMatch(projects, /"routes"/);
  assert.doesNotMatch(script, /site-index|cross-search|renderCrossSearch|URLSearchParams|route-chip/i);
  assert.doesNotMatch(html, /crossSearch|跨站检索|直达建议/);
  assert.match(headers, /connect-src 'self';/);
  assert.doesNotMatch(headers, /hthp-patent\.pages\.dev|aak\.nslc\.top/);
});

test("current meta.json matches project counts and omits deep-link metadata", async () => {
  const raw = JSON.parse(await readFile(new URL("../meta.json", import.meta.url), "utf8"));
  assert.equal(raw.schemaVersion, 1);
  assert.equal(raw.site, "project-nav");
  assert.deepEqual(raw.counts, {
    projects: 19,
    public: 13,
    local: 4,
    wip: 2,
    featured: 5
  });
  assert.equal("deepLink" in raw, false);
  assert.equal("searchEntry" in raw, false);
});
