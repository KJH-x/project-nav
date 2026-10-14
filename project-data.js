const ALLOWED_SECTIONS = new Set(["public", "local", "wip"]);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ICON_PATTERN = /^assets\/icons\/(?:source|custom)\/[a-z0-9][a-z0-9._-]*\.(?:svg|png|webp)$/;

export function isSafeProjectUrl(value, baseUrl = "https://example.invalid/") {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value, baseUrl);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function isSafeIconPath(value) {
  return typeof value === "string" && ICON_PATTERN.test(value);
}

function validateOptionalFields(project) {
  const problems = [];

  if (project.updated != null && (
    typeof project.updated !== "string" || !DATE_PATTERN.test(project.updated)
  )) {
    problems.push("updated must use YYYY-MM-DD");
  }

  if (project.featured != null && typeof project.featured !== "boolean") {
    problems.push("featured must be a boolean");
  }

  if (project.routes != null) {
    problems.push("routes is no longer supported");
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
    } else if (typeof project.desc !== "string" || !project.desc.trim()) {
      reason = "desc must be a non-empty string";
    } else if (typeof project.kind !== "string" || !project.kind.trim()) {
      reason = "kind must be a non-empty string";
    } else if (typeof project.coverLabel !== "string" || !project.coverLabel.trim() || project.coverLabel.length > 8) {
      reason = "coverLabel must be a non-empty string up to 8 characters";
    } else if (!Array.isArray(project.tags) || project.tags.some((tag) => typeof tag !== "string")) {
      reason = "tags must be an array of strings";
    } else if (!ALLOWED_SECTIONS.has(project.section)) {
      reason = "section must be public, local, or wip";
    } else if (!isSafeProjectUrl(project.url, baseUrl)) {
      reason = "url must use http or https";
    } else if (project.repo && !isSafeProjectUrl(project.repo, baseUrl)) {
      reason = "repo must use http or https";
    } else if (!isSafeIconPath(project.icon)) {
      reason = "icon must be a local project icon asset";
    }

    if (reason) {
      errors.push({ index, reason });
      return;
    }

    seenIds.add(project.id);
    projects.push(project);

    for (const problem of validateOptionalFields(project)) {
      errors.push({ index, reason: problem });
    }
  });

  return { projects, errors };
}
