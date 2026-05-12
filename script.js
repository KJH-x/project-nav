// ===== State =====
const state = {
  projects: [],
  theme: localStorage.getItem("kjh-nav-theme") || "system",
  loading: true,
  error: null
};

// ===== Data Loading =====
async function loadProjects() {
  try {
    const resp = await fetch("projects.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    state.projects = await resp.json();
    state.loading = false;
    state.error = null;
  } catch (err) {
    state.loading = false;
    state.error = err.message || "无法加载项目数据";
  }
}

// ===== Theme =====
function applyTheme(theme) {
  const safe = ["system", "light", "dark"].includes(theme) ? theme : "system";
  document.documentElement.dataset.theme = safe;
  localStorage.setItem("kjh-nav-theme", safe);
}

function bindThemeControls() {
  const select = document.querySelector("#themeSelect");
  select.value = state.theme;
  applyTheme(state.theme);

  select.addEventListener("change", (e) => {
    state.theme = e.target.value;
    applyTheme(state.theme);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.theme === "system") applyTheme("system");
  });
}

// ===== Render =====
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function createCard(project) {
  const tagsHtml = project.tags
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  return `
    <article class="project-card">
      <div class="card-header">
        <div class="card-icon" aria-hidden="true">${escapeHtml(project.icon)}</div>
        <h2 class="card-title">${escapeHtml(project.name)}</h2>
      </div>
      <p class="card-desc">${escapeHtml(project.desc)}</p>
      <div class="card-meta">
        ${tagsHtml}
        <span class="tag" style="font-weight:400;opacity:.7">${escapeHtml(project.domain)}</span>
      </div>
      <div class="card-links">
        <a class="btn btn--primary" href="${escapeHtml(project.url)}" target="_blank" rel="noopener" aria-label="访问 ${escapeHtml(project.name)}">
          🔗 访问
        </a>
        <a class="btn btn--outline" href="${escapeHtml(project.repo)}" target="_blank" rel="noopener" aria-label="${escapeHtml(project.name)} GitHub 仓库">
          ⬡ GitHub
        </a>
      </div>
    </article>
  `;
}

function renderAll() {
  const grid = document.querySelector("#projectGrid");

  if (state.loading) {
    grid.innerHTML = `<p class="loading-text">加载中…</p>`;
    return;
  }

  if (state.error) {
    grid.innerHTML = `<div class="message-box message-box--error"><p>${escapeHtml(state.error)}</p><button id="retryBtn" class="btn btn--primary">重试</button></div>`;
    document.querySelector("#retryBtn")?.addEventListener("click", init);
    return;
  }

  grid.innerHTML = state.projects.map(createCard).join("");
}

// ===== Init =====
async function init() {
  bindThemeControls();
  renderAll();
  await loadProjects();
  renderAll();
}

init();
