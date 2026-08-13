(() => {
  "use strict";

  const FALLBACK_PROJECTS = [
    {
      id: "fallback-directory",
      title: "Project Directory",
      desc: "A public catalog of hosted projects, tools, notes, and experiments.",
      section: "public",
      tags: ["directory", "static", "vanilla-js"],
      url: "/"
    },
    {
      id: "fallback-cloudflare",
      title: "Cloudflare Pages Projects",
      desc: "Static deployments served from Cloudflare Pages.",
      section: "public",
      tags: ["cloudflare", "pages"],
      url: "/projects.json"
    }
  ];

  const DEFAULTS = {
    rootSelector: "#screensaver",
    idleMs: 30 * 60 * 1000,
    cardMs: 12 * 1000,
    mouseMoveThrottleMs: 250,
    getProjects: null
  };

  function initProjectScreensaver(userOptions) {
    const options = Object.assign({}, DEFAULTS, userOptions);

    const root = document.querySelector(options.rootSelector);
    if (!root) {
      console.warn("[screensaver] Missing root element:", options.rootSelector);
      return null;
    }

    const els = {
      clock: root.querySelector("#screensaver-clock"),
      date: root.querySelector("#screensaver-date"),
      cardKicker: root.querySelector("#screensaver-card-kicker"),
      title: root.querySelector("#screensaver-project-title"),
      desc: root.querySelector("#screensaver-project-description"),
      tags: root.querySelector("#screensaver-project-tags"),
      url: root.querySelector("#screensaver-project-url")
    };

    const runtime = {
      active: false,
      dismissing: false,
      dismissPoint: null,
      lastActivityAt: Date.now(),
      lastMouseMoveAt: 0,
      projectIndex: 0,
      idleTimerId: null,
      clockTimerId: null,
      cardTimerId: null,
      previouslyFocused: null,
      inertedElements: []
    };

    const timeFmt = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit"
    });

    const dateFmt = new Intl.DateTimeFormat(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    function getProjects() {
      if (typeof options.getProjects === "function") {
        const p = options.getProjects();
        if (Array.isArray(p) && p.length > 0) return p;
      }
      if (window.state && Array.isArray(window.state.projects) && window.state.projects.length > 0) {
        return window.state.projects;
      }
      return FALLBACK_PROJECTS;
    }

    function getScreensaverProjects() {
      const all = getProjects();
      const valid = all.filter(function (p) {
        var name = p && (p.name || p.title);
        return typeof name === "string" && name.trim();
      });

      const featured = valid.filter(function (p) { return p.featured === true; });
      if (featured.length > 0) return featured;

      const pub = valid.filter(function (p) {
        return (p.section || "").toLowerCase().trim() === "public";
      });
      if (pub.length > 0) return pub;

      return valid.length > 0 ? valid : FALLBACK_PROJECTS;
    }

    function setText(node, value) {
      if (node) node.textContent = value == null ? "" : String(value);
    }

    function renderClock() {
      var now = new Date();
      setText(els.clock, timeFmt.format(now));
      setText(els.date, dateFmt.format(now));
    }

    function renderProjectCard() {
      var projects = getScreensaverProjects();
      var project = projects[runtime.projectIndex % projects.length];
      runtime.projectIndex += 1;

      var section = project.section ? String(project.section) : "project";
      var tags = Array.isArray(project.tags) ? project.tags : [];
      var desc = project.desc || project.description || project.summary || "No description provided.";

      setText(els.cardKicker, section + " project");
      setText(els.title, project.name || project.title);
      setText(els.desc, desc);
      setText(els.url, project.url || "");

      if (els.tags) {
        els.tags.replaceChildren();
        for (var i = 0; i < Math.min(tags.length, 6); i++) {
          var tagEl = document.createElement("span");
          tagEl.className = "screensaver__tag";
          tagEl.textContent = String(tags[i]);
          els.tags.append(tagEl);
        }
      }
    }

    function startActiveTimers() {
      renderClock();
      renderProjectCard();

      clearInterval(runtime.clockTimerId);
      clearInterval(runtime.cardTimerId);

      runtime.clockTimerId = window.setInterval(renderClock, 1000);
      runtime.cardTimerId = window.setInterval(renderProjectCard, options.cardMs);
    }

    function stopActiveTimers() {
      clearInterval(runtime.clockTimerId);
      clearInterval(runtime.cardTimerId);
      runtime.clockTimerId = null;
      runtime.cardTimerId = null;
    }

    function showScreensaver() {
      if (runtime.active) return;
      if (document.visibilityState === "hidden") return;

      runtime.active = true;
      runtime.dismissing = false;
      runtime.dismissPoint = null;
      runtime.previouslyFocused = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
      runtime.inertedElements = [];
      for (var i = 0; i < document.body.children.length; i++) {
        var child = document.body.children[i];
        if (child === root || child.tagName === "SCRIPT" || child.hasAttribute("inert")) continue;
        child.setAttribute("inert", "");
        runtime.inertedElements.push(child);
      }

      root.hidden = false;
      root.setAttribute("aria-hidden", "false");
      root.focus({ preventScroll: true });

      startActiveTimers();
    }

    function hideScreensaver() {
      if (!runtime.active) return;
      runtime.active = false;

      stopActiveTimers();

      root.hidden = true;
      root.setAttribute("aria-hidden", "true");
      for (var i = 0; i < runtime.inertedElements.length; i++) {
        runtime.inertedElements[i].removeAttribute("inert");
      }
      runtime.inertedElements = [];

      var focusTarget = runtime.previouslyFocused;
      runtime.previouslyFocused = null;
      if (focusTarget && focusTarget.isConnected && typeof focusTarget.focus === "function") {
        focusTarget.focus({ preventScroll: true });
      }
    }

    function scheduleIdleCheck() {
      clearTimeout(runtime.idleTimerId);

      var elapsed = Date.now() - runtime.lastActivityAt;
      var remaining = Math.max(0, options.idleMs - elapsed);

      runtime.idleTimerId = window.setTimeout(function () {
        var trulyIdle = Date.now() - runtime.lastActivityAt >= options.idleMs;
        if (trulyIdle) {
          showScreensaver();
        } else {
          scheduleIdleCheck();
        }
      }, remaining);
    }

    var dismissEvents = {
      pointerdown: true,
      mousedown: true,
      touchstart: true,
      keydown: true
    };

    function dismissScreensaver(event) {
      if (runtime.dismissing) return;
      runtime.dismissing = true;

      var x;
      var y;

      if (event && event.type === "touchstart" && event.changedTouches && event.changedTouches.length > 0) {
        x = event.changedTouches[0].clientX;
        y = event.changedTouches[0].clientY;
      } else if (event && typeof event.clientX === "number") {
        x = event.clientX;
        y = event.clientY;
      } else {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
      }

      runtime.dismissPoint = { x: x, y: y };

      hideScreensaver();
    }

    function recordActivity(event) {
      var now = Date.now();

      if (
        event &&
        event.type === "mousemove" &&
        !runtime.active &&
        now - runtime.lastMouseMoveAt < options.mouseMoveThrottleMs
      ) {
        return;
      }

      if (event && event.type === "mousemove") {
        runtime.lastMouseMoveAt = now;
      }

      runtime.lastActivityAt = now;

      if (runtime.active && event && dismissEvents[event.type]) {
        dismissScreensaver(event);
      }

      scheduleIdleCheck();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        stopActiveTimers();
        clearTimeout(runtime.idleTimerId);
        runtime.idleTimerId = null;
        return;
      }

      if (runtime.active) {
        startActiveTimers();
        return;
      }

      var idleLongEnough = Date.now() - runtime.lastActivityAt >= options.idleMs;
      if (idleLongEnough) {
        showScreensaver();
      } else {
        scheduleIdleCheck();
      }
    }

    var activityEvents = ["mousemove", "mousedown", "keydown", "wheel", "pointerdown", "touchstart"];

    function onActivity(e) { recordActivity(e); }
    function onVisChange() { handleVisibilityChange(); }

    for (var i = 0; i < activityEvents.length; i++) {
      window.addEventListener(activityEvents[i], onActivity, { passive: true, capture: true });
    }

    document.addEventListener("visibilitychange", onVisChange);

    scheduleIdleCheck();

    return {
      show: showScreensaver,
      hide: hideScreensaver,
      reset: function () { recordActivity(null); },
      destroy: function () {
        hideScreensaver();
        clearTimeout(runtime.idleTimerId);
        stopActiveTimers();
        for (var i = 0; i < activityEvents.length; i++) {
          window.removeEventListener(activityEvents[i], onActivity, { capture: true });
        }
        document.removeEventListener("visibilitychange", onVisChange);
      }
    };
  }

  window.initProjectScreensaver = initProjectScreensaver;
})();
