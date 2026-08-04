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
  });

  return { projects, errors };
}
