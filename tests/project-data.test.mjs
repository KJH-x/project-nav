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

test("optional fields (routes/updated/stats) validate without breaking pass-through", () => {
  const withOptional = {
    id: "opt",
    name: "Opt",
    url: "https://example.com/",
    tags: [],
    section: "public",
    updated: "2026-08-29",
    stats: { count: 1 },
    routes: [
      { label: "直达", url: "https://example.com/#52" },
      { label: "坏链接", url: "javascript:alert(1)" }
    ]
  };
  const result = validateProjects([withOptional], "https://nav.example/");
  assert.equal(result.projects.length, 1);
  assert.deepEqual(result.errors.map((error) => error.reason), ["routes[1].url must use http or https"]);

  const badUpdated = validateProjects([{ ...withOptional, updated: 2026, routes: "nope" }], "https://nav.example/");
  assert.deepEqual(badUpdated.errors.map((error) => error.reason), [
    "updated must be a string",
    "routes must be an array"
  ]);
});

test("routes[] supports optional wip flag (X-A2)", () => {
  const base = {
    id: "wip-route",
    name: "Wip Route",
    url: "https://example.com/",
    tags: [],
    section: "public"
  };
  const ok = validateProjects([
    { ...base, routes: [{ label: "稳定", url: "https://example.com/#1" }, { label: "待稳定", url: "https://example.com/#L42", wip: true }] }
  ], "https://nav.example/");
  assert.equal(ok.errors.length, 0);

  const bad = validateProjects([
    { ...base, routes: [{ label: "错类型", url: "https://example.com/", wip: "yes" }] }
  ], "https://nav.example/");
  assert.deepEqual(bad.errors.map((error) => error.reason), ["routes[0].wip must be a boolean"]);
});

test("current project data carries routes[] for deep-linkable sites (X-A2)", async () => {
  const raw = JSON.parse(await readFile(new URL("../projects.json", import.meta.url), "utf8"));
  const withRoutes = raw.filter((p) => Array.isArray(p.routes) && p.routes.length > 0);
  const ids = withRoutes.map((p) => p.id).sort();
  assert.deepEqual(ids, ["ak-operator-list", "ak-reader", "cls-page", "hthp-patent"]);
  for (const p of withRoutes) {
    assert.ok(p.routes.every((r) => r.label && r.url.startsWith("https://")));
  }
  const akReader = raw.find((p) => p.id === "ak-reader");
  assert.ok(akReader.routes.some((r) => r.wip === true), "ak-reader unstable deep links marked wip");
});

test("current site-index.json is well-formed", async () => {
  const raw = JSON.parse(await readFile(new URL("../site-index.json", import.meta.url), "utf8"));
  assert.equal(raw.schemaVersion, 1);
  assert.ok(Array.isArray(raw.sites) && raw.sites.length >= 4);
  assert.ok(Array.isArray(raw.fallback));
  const ids = raw.sites.map((s) => s.id);
  assert.ok(ids.includes("aak") && ids.includes("cls") && ids.includes("hthp") && ids.includes("ak-reader"));
  for (const site of raw.sites) {
    assert.ok(typeof site.url === "string" && site.url.startsWith("https://"));
    assert.ok(Array.isArray(site.deepLinks));
    assert.ok(site.search && typeof site.search.type === "string");
  }
});

test("site-index.json carries updated timestamps; ak-reader hides badge (X-A3)", async () => {
  const raw = JSON.parse(await readFile(new URL("../site-index.json", import.meta.url), "utf8"));
  const byId = Object.fromEntries(raw.sites.map((s) => [s.id, s]));
  for (const id of ["aak", "cls", "hthp"]) {
    assert.match(byId[id].updated, /^\d{4}-\d{2}-\d{2}$/, `${id}.updated must be YYYY-MM-DD`);
    assert.ok(typeof byId[id].version === "string", `${id}.version must be a string`);
  }
  assert.ok(byId["ak-reader"].updated == null, "ak-reader has no deployed timestamp, badge must be hidden");
});

test("current meta.json is well-formed (X-B4 schema)", async () => {
  const raw = JSON.parse(await readFile(new URL("../meta.json", import.meta.url), "utf8"));
  assert.equal(raw.schemaVersion, 1);
  assert.equal(raw.site, "project-nav");
  assert.ok(typeof raw.generatedAt === "string");
  assert.ok(typeof raw.updated === "string");
  assert.ok(typeof raw.searchEntry === "string");
  assert.ok(typeof raw.counts.projects === "number");
});
