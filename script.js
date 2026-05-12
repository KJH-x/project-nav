// ===== Project Data (手动维护) =====
const projects = [
  {
    id: "g-ncns",
    name: "NPSJP Apple",
    domain: "ncns.nsapi.top",
    url: "https://ncns.nsapi.top",
    repo: "https://github.com/KJH-x/g-ncns",
    icon: "🍎",
    desc: "Apple 服务状态与信息汇总页，提供 Apple ID 相关工具的快速入口和使用指引。",
    tags: ["Apple", "工具"],
    kind: "service"
  },
  {
    id: "ak-operator-list",
    name: "Arknights Operator List",
    domain: "aak.nslc.top",
    url: "https://aak.nslc.top",
    repo: "https://github.com/KJH-x/ak-operator-list",
    icon: "📋",
    desc: "明日方舟干员资料库，支持检索、筛选和查看干员详细信息、技能、天赋与精英化材料。",
    tags: ["明日方舟", "数据库"],
    kind: "game"
  },
  {
    id: "card-page",
    name: "Card Page",
    domain: "bz.nslc.top",
    url: "https://bz.nslc.top",
    repo: "https://github.com/KJH-x/card-page-3wn",
    icon: "🪪",
    desc: "个人名片与链接汇总页，集中展示社交媒体、博客、GitHub 等平台的个人入口。",
    tags: ["个人页", "链接"],
    kind: "personal"
  },
  {
    id: "cls-page",
    name: "Class Page",
    domain: "cls.nslc.top",
    url: "https://cls.nslc.top",
    repo: "https://github.com/KJH-x/cls-page",
    icon: "📚",
    desc: "课程资料与班级信息页面，用于课程相关资源的集中展示和分享。",
    tags: ["教育", "课程"],
    kind: "education"
  },
  {
    id: "echoes-of-terra",
    name: "Echoes of Terra",
    domain: "echos.nslc.top",
    url: "https://echos.nslc.top",
    repo: "https://github.com/KJH-x/echoes-of-terra",
    icon: "🎵",
    desc: "《明日方舟》五周年「泰拉巡旅」网页活动的离线备份，支持完全自定义参数调整，可在官方活动下线后继续访问。",
    tags: ["明日方舟", "活动备份", "离线版"],
    kind: "game"
  },
  {
    id: "icon-gallery",
    name: "Icon Gallery",
    domain: "icon.nslc.top",
    url: "https://icon.nslc.top",
    repo: "https://github.com/KJH-x/icon-gallery",
    icon: "🎨",
    desc: "图标画廊，集中展示和管理各类图标资源，支持分类浏览和快速检索。",
    tags: ["图标", "设计资源"],
    kind: "design"
  },
  {
    id: "maa-status",
    name: "MAA Status",
    domain: "maa.nslc.top",
    url: "https://maa.nslc.top",
    repo: "https://github.com/KJH-x/maa-status-frontend",
    icon: "📊",
    desc: "MAA OneBot Adapter 运行状态前端面板，实时显示适配器连接状态、任务队列和运行日志。",
    tags: ["MAA", "监控", "自动化"],
    kind: "tool"
  },
  {
    id: "noise-image",
    name: "Noise Image",
    domain: "ni.nslc.top",
    url: "https://ni.nslc.top",
    repo: "https://github.com/KJH-x/noise-image",
    icon: "🌌",
    desc: "噪点/噪声图片生成器，支持 Perlin 噪声、白噪声等多种算法，可调整参数生成自定义纹理图片。",
    tags: ["图像", "生成器"],
    kind: "tool"
  },
  {
    id: "cal4rouge",
    name: "Cal4Rouge",
    domain: "rgc.nslc.top",
    url: "https://rgc.nslc.top",
    repo: "https://github.com/KJH-x/cal4rouge",
    icon: "🧮",
    desc: "明日方舟集成战略（肉鸽）模式计算器，帮助规划招募、资源分配和路线选择。",
    tags: ["明日方舟", "计算器", "肉鸽"],
    kind: "game"
  },
  {
    id: "script-gallery",
    name: "Script Gallery",
    domain: "script.nslc.top",
    url: "https://script.nslc.top",
    repo: "https://github.com/KJH-x/script-gallery",
    icon: "📜",
    desc: "小脚本工具箱，集中展示常用 Python 小脚本，支持搜索、标签筛选、在线查看代码并一键复制下载。",
    tags: ["工具箱", "Python", "脚本"],
    kind: "tool"
  }
];

// ===== State =====
const state = {
  theme: localStorage.getItem("kjh-nav-theme") || "system"
};

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
  grid.innerHTML = projects.map(createCard).join("");
}

// ===== Init =====
function init() {
  bindThemeControls();
  renderAll();
}

init();
