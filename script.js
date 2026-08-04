import { validateProjects } from "./project-data.js";

// ===== Pinyin Map =====
const PINYIN_MAP = /* @__PURE__ */ new Map([
  ["阿","a"],["安","an"],["按","an"],["捌","ba"],["罢","ba"],["白","bai"],["百","bai"],
  ["佰","bai"],["败","bai"],["板","ban"],["版","ban"],["半","ban"],["包","bao"],["保","bao"],
  ["报","bao"],["备","bei"],["背","bei"],["被","bei"],["本","ben"],["比","bi"],["币","bi"],
  ["必","bi"],["闭","bi"],["哔","bi"],["壁","bi"],["编","bian"],["变","bian"],["遍","bian"],
  ["辨","bian"],["标","biao"],["表","biao"],["别","bie"],["并","bing"],["伯","bo"],["不","bu"],
  ["布","bu"],["步","bu"],["部","bu"],["才","cai"],["财","cai"],["采","cai"],["彩","cai"],
  ["参","can"],["藏","cang"],["操","cao"],["测","ce"],["查","cha"],["差","cha"],["尝","chang"],
  ["常","chang"],["场","chang"],["车","che"],["称","cheng"],["成","cheng"],["程","cheng"],
  ["持","chi"],["尺","chi"],["抽","chou"],["出","chu"],["初","chu"],["除","chu"],["础","chu"],
  ["储","chu"],["处","chu"],["触","chu"],["串","chuan"],["窗","chuang"],["创","chuang"],
  ["纯","chun"],["戳","chuo"],["词","ci"],["此","ci"],["次","ci"],["从","cong"],["存","cun"],
  ["寸","cun"],["错","cuo"],["达","da"],["打","da"],["大","da"],["代","dai"],["带","dai"],
  ["待","dai"],["单","dan"],["当","dang"],["导","dao"],["到","dao"],["道","dao"],["地","di"],
  ["的","de"],["等","deng"],["低","di"],["递","di"],["第","di"],["典","dian"],["点","dian"],
  ["调","diao"],["掉","diao"],["叠","die"],["顶","ding"],["定","ding"],["动","dong"],
  ["都","dou"],["逗","dou"],["独","du"],["读","du"],["度","du"],["端","duan"],["短","duan"],
  ["段","duan"],["断","duan"],["对","dui"],["多","duo"],["额","e"],["而","er"],["尔","er"],
  ["二","er"],["贰","er"],["发","fa"],["法","fa"],["反","fan"],["返","fan"],["范","fan"],
  ["方","fang"],["防","fang"],["放","fang"],["非","fei"],["分","fen"],["风","feng"],["否","fou"],
  ["符","fu"],["附","fu"],["复","fu"],["副","fu"],["改","gai"],["概","gai"],["干","gan"],
  ["高","gao"],["告","gao"],["格","ge"],["隔","ge"],["个","ge"],["各","ge"],["给","gei"],
  ["更","geng"],["工","gong"],["功","gong"],["供","gong"],["共","gong"],["构","gou"],
  ["关","guan"],["管","guan"],["广","guang"],["归","gui"],["规","gui"],["果","guo"],["过","guo"],
  ["哈","ha"],["还","hai"],["含","han"],["函","han"],["汉","han"],["号","hao"],["合","he"],
  ["和","he"],["黑","hei"],["红","hong"],["后","hou"],["忽","hu"],["互","hu"],["化","hua"],
  ["环","huan"],["换","huan"],["灰","hui"],["回","hui"],["汇","hui"],["会","hui"],["绘","hui"],
  ["或","huo"],["获","huo"],["霍","huo"],["击","ji"],["机","ji"],["基","ji"],["及","ji"],
  ["即","ji"],["辑","ji"],["计","ji"],["记","ji"],["际","ji"],["继","ji"],["加","jia"],
  ["夹","jia"],["间","jian"],["监","jian"],["减","jian"],["剪","jian"],["检","jian"],["件","jian"],
  ["建","jian"],["键","jian"],["将","jiang"],["降","jiang"],["交","jiao"],["角","jiao"],
  ["脚","jiao"],["阶","jie"],["接","jie"],["节","jie"],["结","jie"],["截","jie"],["解","jie"],
  ["金","jin"],["仅","jin"],["进","jin"],["经","jing"],["景","jing"],["警","jing"],["净","jing"],
  ["径","jing"],["境","jing"],["镜","jing"],["玖","jiu"],["就","jiu"],["具","ju"],["据","ju"],
  ["均","jun"],["卡","ka"],["开","kai"],["看","kan"],["科","ke"],["可","ke"],["空","kong"],
  ["控","kong"],["口","kou"],["库","ku"],["跨","kua"],["块","kuai"],["快","kuai"],["宽","kuan"],
  ["框","kuang"],["扩","kuo"],["拉","la"],["赖","lai"],["栏","lan"],["览","lan"],["了","le"],
  ["类","lei"],["哩","li"],["离","li"],["里","li"],["理","li"],["历","li"],["立","li"],
  ["例","li"],["连","lian"],["链","lian"],["两","liang"],["亮","liang"],["量","liang"],
  ["列","lie"],["零","ling"],["令","ling"],["另","ling"],["流","liu"],["留","liu"],["六","liu"],
  ["陆","lu"],["录","lu"],["路","lu"],["率","lv"],["滤","lv"],["乱","luan"],["略","lve"],
  ["论","lun"],["络","luo"],["码","ma"],["么","me"],["没","mei"],["每","mei"],["门","men"],
  ["蒙","meng"],["密","mi"],["描","miao"],["民","min"],["名","ming"],["明","ming"],["命","ming"],
  ["摹","mo"],["模","mo"],["末","mo"],["默","mo"],["某","mou"],["母","mu"],["目","mu"],
  ["幕","mu"],["内","nei"],["能","neng"],["拟","ni"],["逆","ni"],["拍","pai"],["排","pai"],
  ["盘","pan"],["配","pei"],["批","pi"],["匹","pi"],["片","pian"],["频","pin"],["平","ping"],
  ["评","ping"],["屏","ping"],["普","pu"],["柒","qi"],["期","qi"],["其","qi"],["启","qi"],
  ["起","qi"],["弃","qi"],["器","qi"],["仟","qian"],["签","qian"],["前","qian"],["敲","qiao"],
  ["且","qie"],["切","qie"],["清","qing"],["请","qing"],["求","qiu"],["区","qu"],["取","qu"],
  ["去","qu"],["全","quan"],["权","quan"],["确","que"],["热","re"],["人","ren"],["认","ren"],
  ["任","ren"],["日","ri"],["容","rong"],["如","ru"],["入","ru"],["若","ruo"],["叁","san"],
  ["散","san"],["扫","sao"],["色","se"],["筛","shai"],["删","shan"],["扇","shan"],["上","shang"],
  ["少","shao"],["设","she"],["射","she"],["什","shen"],["生","sheng"],["省","sheng"],
  ["胜","sheng"],["失","shi"],["十","shi"],["时","shi"],["识","shi"],["实","shi"],["拾","shi"],
  ["使","shi"],["始","shi"],["示","shi"],["式","shi"],["事","shi"],["视","shi"],["试","shi"],
  ["是","shi"],["适","shi"],["收","shou"],["首","shou"],["殊","shu"],["输","shu"],["鼠","shu"],
  ["束","shu"],["树","shu"],["数","shu"],["刷","shua"],["水","shui"],["顺","shun"],["说","shuo"],
  ["思","si"],["肆","si"],["素","su"],["速","su"],["算","suan"],["随","sui"],["缩","suo"],
  ["所","suo"],["索","suo"],["他","ta"],["拓","ta"],["台","tai"],["态","tai"],["特","te"],
  ["提","ti"],["题","ti"],["体","ti"],["添","tian"],["填","tian"],["条","tiao"],["跳","tiao"],
  ["贴","tie"],["听","ting"],["停","ting"],["通","tong"],["同","tong"],["统","tong"],
  ["头","tou"],["透","tou"],["图","tu"],["途","tu"],["退","tui"],["拖","tuo"],["外","wai"],
  ["完","wan"],["万","wan"],["网","wang"],["望","wang"],["围","wei"],["维","wei"],["尾","wei"],
  ["为","wei"],["未","wei"],["位","wei"],["文","wen"],["问","wen"],["无","wu"],["伍","wu"],
  ["务","wu"],["误","wu"],["希","xi"],["析","xi"],["息","xi"],["稀","xi"],["洗","xi"],
  ["戏","xi"],["系","xi"],["细","xi"],["下","xia"],["先","xian"],["显","xian"],["险","xian"],
  ["现","xian"],["线","xian"],["限","xian"],["相","xiang"],["箱","xiang"],["响","xiang"],
  ["向","xiang"],["项","xiang"],["象","xiang"],["像","xiang"],["小","xiao"],["效","xiao"],
  ["校","xiao"],["些","xie"],["写","xie"],["新","xin"],["信","xin"],["行","xing"],["形","xing"],
  ["型","xing"],["修","xiu"],["须","xu"],["需","xu"],["许","xu"],["序","xu"],["绪","xu"],
  ["续","xu"],["选","xuan"],["学","xue"],["询","xun"],["循","xun"],["沿","yan"],["颜","yan"],
  ["验","yan"],["样","yang"],["要","yao"],["也","ye"],["页","ye"],["一","yi"],["依","yi"],
  ["壹","yi"],["移","yi"],["已","yi"],["以","yi"],["义","yi"],["亿","yi"],["议","yi"],
  ["异","yi"],["意","yi"],["音","yin"],["引","yin"],["印","yin"],["应","ying"],["映","ying"],
  ["硬","ying"],["用","yong"],["由","you"],["游","you"],["有","you"],["于","yu"],["余","yu"],
  ["与","yu"],["预","yu"],["域","yu"],["元","yuan"],["原","yuan"],["源","yuan"],["约","yue"],
  ["云","yun"],["允","yun"],["运","yun"],["杂","za"],["在","zai"],["载","zai"],["造","zao"],
  ["则","ze"],["择","ze"],["增","zeng"],["展","zhan"],["站","zhan"],["长","zhang"],["找","zhao"],
  ["真","zhen"],["整","zheng"],["正","zheng"],["证","zheng"],["支","zhi"],["执","zhi"],
  ["直","zhi"],["值","zhi"],["止","zhi"],["只","zhi"],["址","zhi"],["纸","zhi"],["指","zhi"],
  ["至","zhi"],["制","zhi"],["质","zhi"],["置","zhi"],["中","zhong"],["终","zhong"],["钟","zhong"],
  ["种","zhong"],["重","zhong"],["舟","zhou"],["轴","zhou"],["逐","zhu"],["主","zhu"],
  ["住","zhu"],["注","zhu"],["柱","zhu"],["拽","zhuai"],["转","zhuan"],["装","zhuang"],
  ["状","zhuang"],["追","zhui"],["缀","zhui"],["准","zhun"],["子","zi"],["字","zi"],["自","zi"],
  ["总","zong"],["奏","zou"],["组","zu"],["最","zui"],["左","zuo"],["作","zuo"],["坐","zuo"],
  ["署","shu"],["亚","ya"],["克","ke"],["力","li"],["挂","gua"],["史","shi"],["户","hu"],
  ["档","dang"],["集","ji"],["画","hua"],["静","jing"],["超","chao"],["龙","long"],["山","shan"],
  ["搜","sou"],["拦","lan"],["伪","wei"],["强","qiang"],["边","bian"],["渐","jian"],["影","ying"],
  ["面","mian"],["志","zhi"],["纹","wen"],["灯","deng"],["廊","lang"],["份","fen"],["员","yuan"],
  ["社","she"],["媒","mei"],["博","bo"],["班","ban"],["享","xiang"],["肉","rou"],["鸽","ge"],
  ["活","huo"],["巡","xun"],["旅","lv"],["资","zi"],["料","liao"],["技","ji"],["赋","fu"],
  ["精","jing"],["英","ying"],["华","hua"],["预","yu"],["题","ti"],["网","wang"],["游","you"],
  ["纲","gang"],["浅","qian"],
]);

// ===== Utility Functions =====
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function charToPinyin(text) {
  let result = "";
  for (const ch of text) {
    const py = PINYIN_MAP.get(ch);
    result += py || ch;
  }
  return result;
}

function buildSearchText(project) {
  const parts = [
    project.name,
    project.desc,
    ...project.tags,
    project.domain,
    project.kind
  ];
  const base = normalizeText(parts.join(" "));
  const pinyin = charToPinyin(base);
  return base + " " + pinyin;
}

// ===== Section Definitions =====
const SECTION_DEFS = [
  { id: "public", title: "公网访问", defaultOpen: true },
  { id: "local", title: "内网链接", defaultOpen: false },
  { id: "wip", title: "未完成", defaultOpen: false }
];

// ===== State =====
const state = {
  projects: [],
  theme: localStorage.getItem("kjh-nav-theme") || "system",
  query: "",
  selectedTags: new Set(),
  sections: { public: true, local: false, wip: false },
  loading: true,
  error: null
};

function setState(patch) {
  Object.assign(state, patch);
  renderAll();
}

// ===== DOM Refs =====
const dom = {
  searchInput: document.getElementById("searchInput"),
  filterChips: document.getElementById("filterChips"),
  themeSelect: document.getElementById("themeSelect"),
  emptyState: document.getElementById("emptyState"),
  resultsStatus: document.getElementById("resultsStatus"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  retryBtn: null
};

function getGrid(id) { return document.getElementById("grid-" + id); }
function getBody(id) { return document.getElementById("body-" + id); }
function getHeader(id) { return document.querySelector("#section-" + id + " .section-header"); }
function getCount(id) { return document.getElementById("count-" + id); }

// ===== Theme =====
function applyTheme(theme) {
  const safe = ["system", "light", "dark"].includes(theme) ? theme : "system";
  document.documentElement.dataset.theme = safe;
  localStorage.setItem("kjh-nav-theme", safe);
}

function bindThemeControls() {
  dom.themeSelect.value = state.theme;
  applyTheme(state.theme);

  dom.themeSelect.addEventListener("change", (e) => {
    state.theme = e.target.value;
    applyTheme(state.theme);
  });

  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.theme === "system") applyTheme("system");
  });
}

function enrichProject(p) {
  const searchText = buildSearchText(p);
  const normalizedTags = p.tags.map(function (t) { return normalizeText(t); });
  return Object.assign({}, p, { searchText: searchText, normalizedTags: normalizedTags });
}

// ===== Data Loading =====
async function loadProjects() {
  try {
    const resp = await fetch("projects.json");
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const raw = await resp.json();
    const validated = validateProjects(raw, window.location.href);
    for (const error of validated.errors) {
      console.warn(`[projects] Skipped entry ${error.index}: ${error.reason}`);
    }
    state.projects = validated.projects.map(enrichProject);
    state.loading = false;
    state.error = null;
  } catch (err) {
    state.loading = false;
    state.error = err.message || "无法加载项目数据";
  }
}

// ===== Filter Logic =====
function applyFilters(projects) {
  const q = normalizeText(state.query);
  let filtered = projects;

  if (q) {
    filtered = filtered.filter(function (p) { return p.searchText.includes(q); });
  }

  if (state.selectedTags.size > 0) {
    filtered = filtered.filter(function (p) {
      return [...state.selectedTags].every(function (tag) { return p.normalizedTags.includes(tag); });
    });
  }

  return filtered;
}

function groupBySection(projects) {
  const groups = {};
  for (const def of SECTION_DEFS) {
    const sectionProjects = projects.filter(p => p.section === def.id);
    groups[def.id] = applyFilters(sectionProjects);
  }
  return groups;
}

// ===== Section Toggle =====
function applySectionState(sectionId) {
  const body = getBody(sectionId);
  const header = getHeader(sectionId);
  if (!body || !header) return;
  const isOpen = state.sections[sectionId];
  body.hidden = !isOpen;
  header.classList.toggle("section-header--collapsed", !isOpen);
  header.setAttribute("aria-expanded", String(isOpen));
}

function toggleSection(sectionId) {
  if (!(sectionId in state.sections)) return;
  state.sections[sectionId] = !state.sections[sectionId];
  applySectionState(sectionId);
}

function expandSection(sectionId) {
  if (!(sectionId in state.sections)) return;
  state.sections[sectionId] = true;
  applySectionState(sectionId);
}

function applyAllSectionStates() {
  for (const id in state.sections) {
    applySectionState(id);
  }
}

function bindSectionToggles() {
  for (const def of SECTION_DEFS) {
    const header = getHeader(def.id);
    if (header) {
      header.addEventListener("click", () => toggleSection(def.id));
    }
  }
}

// ===== Render =====
function renderTagFilters() {
  if (state.projects.length === 0) {
    dom.filterChips.innerHTML = "";
    return;
  }

  const allTags = [...new Set(state.projects.flatMap(p => p.tags))]
    .sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

  dom.filterChips.innerHTML = allTags.map(tag => {
    const active = state.selectedTags.has(normalizeText(tag));
    return `<button class="filter-chip${active ? " filter-chip--active" : ""}" data-tag="${escapeHtml(tag)}" aria-pressed="${active}" type="button">${escapeHtml(tag)}</button>`;
  }).join("");
}

function createCard(project) {
  const tagsHtml = project.tags
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join("");

  const ghBtn = project.repo
    ? `<a class="btn btn--outline" href="${escapeHtml(project.repo)}" target="_blank" rel="noopener" aria-label="${escapeHtml(project.name)} GitHub 仓库">⬡ GitHub</a>`
    : "";

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
        ${ghBtn}
      </div>
    </article>
  `;
}

function renderAll() {
  if (state.loading) {
    getGrid("public").innerHTML = `<p class="loading-text">加载中…</p>`;
    for (const def of SECTION_DEFS) {
      if (def.id !== "public") getGrid(def.id).innerHTML = "";
      getCount(def.id).textContent = "0";
    }
    dom.emptyState.hidden = true;
    dom.resultsStatus.textContent = "正在加载项目";
    return;
  }

  if (state.error) {
    getGrid("public").innerHTML = `<div class="message-box message-box--error"><p>${escapeHtml(state.error)}</p><button id="retryBtn" class="btn btn--primary">重试</button></div>`;
    for (const def of SECTION_DEFS) {
      if (def.id !== "public") getGrid(def.id).innerHTML = "";
      getCount(def.id).textContent = "0";
    }
    dom.emptyState.hidden = true;
    dom.resultsStatus.textContent = "项目加载失败";
    dom.retryBtn = document.getElementById("retryBtn");
    dom.retryBtn?.addEventListener("click", retry);
    return;
  }

  const groups = groupBySection(state.projects);
  let totalVisible = 0;
  const hasActiveFilter = state.query || state.selectedTags.size > 0;

  for (const def of SECTION_DEFS) {
    const filtered = groups[def.id];
    const grid = getGrid(def.id);
    const count = getCount(def.id);

    count.textContent = filtered.length;

    if (filtered.length === 0) {
      grid.innerHTML = "";
    } else {
      grid.innerHTML = filtered.map(createCard).join("");
    }

    totalVisible += filtered.length;

    if (hasActiveFilter && filtered.length > 0) {
      expandSection(def.id);
    }
  }

  dom.emptyState.hidden = totalVisible > 0;
  dom.resultsStatus.textContent = `共 ${totalVisible} 个项目`;

  applyAllSectionStates();
}

// ===== Event Bindings =====
function bindSearch() {
  dom.searchInput.addEventListener("input", () => {
    state.query = dom.searchInput.value;
    renderAll();
  });
}

function bindTagFilters() {
  dom.filterChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    const tag = normalizeText(chip.dataset.tag);
    if (state.selectedTags.has(tag)) {
      state.selectedTags.delete(tag);
    } else {
      state.selectedTags.add(tag);
    }
    const active = state.selectedTags.has(tag);
    chip.classList.toggle("filter-chip--active", active);
    chip.setAttribute("aria-pressed", String(active));
    renderAll();
  });
}

// ===== Retry =====
async function retry() {
  state.loading = true;
  state.error = null;
  renderAll();
  await loadProjects();
  renderTagFilters();
  renderAll();
}

// ===== Clear Filters =====
function clearFilters() {
  state.query = "";
  state.selectedTags.clear();
  dom.searchInput.value = "";
  dom.searchInput.focus();
  renderTagFilters();
  renderAll();
}

// ===== Init =====
async function init() {
  bindThemeControls();
  bindSearch();
  bindTagFilters();
  bindSectionToggles();
  applyAllSectionStates();
  dom.clearFiltersBtn.addEventListener("click", clearFilters);
  renderAll();
  await loadProjects();
  renderTagFilters();
  renderAll();

  if (typeof window.initProjectScreensaver === "function") {
    window.initProjectScreensaver({
      getProjects: function () { return state.projects; },
      idleMs: 30 * 60 * 1000,
      cardMs: 12 * 1000
    });
  }
}

init();
