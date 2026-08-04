import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

test("screensaver renders featured project names and restores background focus", async () => {
  const source = await readFile(new URL("../screensaver.js", import.meta.url), "utf8");
  const projects = JSON.parse(await readFile(new URL("../projects.json", import.meta.url), "utf8"));
  let document;

  class FakeElement {
    constructor(tagName = "DIV") {
      this.tagName = tagName;
      this.hidden = true;
      this.attributes = new Map();
      this.children = [];
      this.textContent = "";
      this.isConnected = true;
      this.focusCount = 0;
    }

    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    }

    removeAttribute(name) {
      this.attributes.delete(name);
    }

    hasAttribute(name) {
      return this.attributes.has(name);
    }

    focus() {
      this.focusCount++;
      document.activeElement = this;
    }

    replaceChildren() {
      this.children = [];
    }

    append(child) {
      this.children.push(child);
    }
  }

  const nodes = new Map([
    ["#screensaver-clock", new FakeElement("TIME")],
    ["#screensaver-date", new FakeElement("P")],
    ["#screensaver-card-kicker", new FakeElement("P")],
    ["#screensaver-project-title", new FakeElement("H2")],
    ["#screensaver-project-description", new FakeElement("P")],
    ["#screensaver-project-tags", new FakeElement("DIV")],
    ["#screensaver-project-url", new FakeElement("P")],
  ]);
  const root = new FakeElement("SECTION");
  root.querySelector = (selector) => nodes.get(selector) || null;
  const background = new FakeElement("MAIN");
  const script = new FakeElement("SCRIPT");

  document = {
    visibilityState: "visible",
    activeElement: background,
    body: { children: [background, root, script] },
    querySelector: (selector) => selector === "#screensaver" ? root : null,
    createElement: (tagName) => new FakeElement(tagName.toUpperCase()),
    addEventListener() {},
    removeEventListener() {},
  };

  let timerId = 0;
  const window = {
    setTimeout: () => ++timerId,
    clearTimeout() {},
    setInterval: () => ++timerId,
    clearInterval() {},
    addEventListener() {},
    removeEventListener() {},
  };
  const context = {
    window,
    document,
    HTMLElement: FakeElement,
    Intl,
    Date,
    Math,
    console,
    setTimeout: window.setTimeout,
    clearTimeout: window.clearTimeout,
    setInterval: window.setInterval,
    clearInterval: window.clearInterval,
  };
  vm.runInNewContext(source, context);

  const screensaver = window.initProjectScreensaver({
    getProjects: () => projects,
    idleMs: 60_000,
  });
  screensaver.show();

  assert.equal(nodes.get("#screensaver-project-title").textContent, "CLS Page");
  assert.equal(background.hasAttribute("inert"), true);
  assert.equal(script.hasAttribute("inert"), false);
  assert.equal(document.activeElement, root);

  screensaver.hide();
  assert.equal(background.hasAttribute("inert"), false);
  assert.equal(document.activeElement, background);
  assert.equal(background.focusCount, 1);
});
