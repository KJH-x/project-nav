import test from "node:test";
import assert from "node:assert/strict";
import { createCrossSearch, buildEntriesForSource } from "../cross-search.js";

const TEST_PINYIN = {
  "凯": "kai", "尔": "er", "希": "xi",
  "热": "re", "泵": "beng", "高": "gao", "温": "wen",
  "专": "zhuan", "利": "li", "阿": "a", "米": "mi", "娅": "ya"
};
const pinyin = (text) => [...String(text)].map((ch) => TEST_PINYIN[ch] || ch).join("").toLowerCase();

test("matchScore ranks exact > prefix > contains > pinyin", () => {
  const { matchScore } = createCrossSearch({ pinyin });
  assert.equal(matchScore("凯尔希", ["凯尔希", "kal", "kaltsit"]), 100);
  assert.ok(matchScore("kaierxi", ["凯尔希"]) >= 30, "pinyin should match");
  assert.ok(matchScore("热泵", ["高温热泵专利"]) >= 60, "contains should match");
  assert.equal(matchScore("zzz-nope", ["凯尔希"]), 0);
});

test("buildEntriesForSource maps aak catalog searchIndex to deep links", () => {
  const source = { type: "aak", url: "https://aak.nslc.top" };
  const payload = {
    searchIndex: [
      { operatorId: "char_002_amiya", name: "阿米娅", tokens: ["阿米娅", "amiya", "amy"] }
    ]
  };
  const entries = buildEntriesForSource(source, payload);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].title, "阿米娅");
  assert.equal(entries[0].route, "https://aak.nslc.top/#q=%E9%98%BF%E7%B1%B3%E5%A8%85");
});

test("buildEntriesForSource maps hthp patents to #p= deep links", () => {
  const source = { type: "hthp", url: "https://hthp-patent.pages.dev" };
  const payload = [
    { PN: "CN101018931A", TITLE: "工作流体", ANCS: ["霍尼韦尔"], IN: [] }
  ];
  const entries = buildEntriesForSource(source, payload);
  assert.equal(entries[0].route, "https://hthp-patent.pages.dev/#p=CN101018931A");
});

test("buildEntriesForSource tolerates unknown source types", () => {
  assert.deepEqual(buildEntriesForSource({ type: "cls", url: "https://cls.nslc.top" }, []), []);
  assert.deepEqual(buildEntriesForSource({ type: "aak", url: "x" }, null), []);
});
