const ALLOWED_SECTIONS = new Set(["public", "local", "wip"]);

export function isSafeProjectUrl(value, baseUrl = "https://example.invalid/") {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function validateOptionalFields(project, baseUrl) {
  const problems = [];

  if (project.updated != null && typeof project.updated !== "string") {
    problems.push("updated must be a string");
  }

  if (project.stats != null && typeof project.stats !== "object") {
    problems.push("stats must be an object");
  }

  if (project.routes != null) {
    if (!Array.isArray(project.routes)) {
      problems.push("routes must be an array");
    } else {
      project.routes.forEach((route, routeIndex) => {
        if (!route || typeof route !== "object") {
          problems.push(`routes[${routeIndex}] must be an object`);
        } else if (typeof route.label !== "string" || !route.label.trim()) {
          problems.push(`routes[${routeIndex}].label must be a non-empty string`);
        } else if (!isSafeProjectUrl(route.url, baseUrl)) {
          problems.push(`routes[${routeIndex}].url must use http or https`);
        } else if (route.wip != null && typeof route.wip !== "boolean") {
          problems.push(`routes[${routeIndex}].wip must be a boolean`);
        }
      });
    }
  }

  return problems;
}

export function validateProjects(raw, baseUrl) {
  if (!Array.isArray(raw)) {
    throw new TypeError("projects.json must contain an array");
  }

  const seenIds = new Set();
  const projects = [];
  const errors = [];

  raw.forEach((project, index) => {
    let reason = null;

    if (!project || typeof project !== "object") {
      reason = "entry must be an object";
    } else if (typeof project.id !== "string" || !project.id.trim()) {
      reason = "id must be a non-empty string";
    } else if (seenIds.has(project.id)) {
      reason = "id must be unique";
    } else if (typeof project.name !== "string" || !project.name.trim()) {
      reason = "name must be a non-empty string";
    } else if (!Array.isArray(project.tags) || project.tags.some((tag) => typeof tag !== "string")) {
      reason = "tags must be an array of strings";
    } else if (!ALLOWED_SECTIONS.has(project.section)) {
      reason = "section must be public, local, or wip";
    } else if (!isSafeProjectUrl(project.url, baseUrl)) {
      reason = "url must use http or https";
    } else if (project.repo && !isSafeProjectUrl(project.repo, baseUrl)) {
      reason = "repo must use http or https";
    }

    if (reason) {
      errors.push({ index, reason });
      return;
    }

    seenIds.add(project.id);
    projects.push(project);

    const optionalProblems = validateOptionalFields(project, baseUrl);
    for (const problem of optionalProblems) {
      errors.push({ index, reason: problem });
    }
  });

  return { projects, errors };
}
