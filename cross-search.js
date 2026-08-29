// cross-search.js — 导航页托管的客户端跨站搜索（X-C1 / X-C2）
// 数据源白名单来自 site-index.json（各站 search 配置：url/type/enabled/cors）。
// CORS 可达源（aak / hthp）运行时 fetch；CORS 不可达 / 无公网域名源回退到 site-index.json 的 fallback 关键词映射表。

const INDEX_CACHE = new Map();

export async function fetchJson(url) {
  if (!url) return { ok: false, error: "no-url" };
  if (!INDEX_CACHE.has(url)) {
    const promise = fetch(url)
      .then((resp) => {
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        return resp.json();
      })
      .then((data) => ({ ok: true, data }))
      .catch((error) => ({ ok: false, error: error.message || String(error) }));
    INDEX_CACHE.set(url, promise);
  }
  return INDEX_CACHE.get(url);
}

export function buildEntriesForSource(source, payload) {
  if (!payload) return [];
  switch (source.type) {
    case "aak": {
      const index = Array.isArray(payload.searchIndex) ? payload.searchIndex : [];
      return index.map((entry) => ({
        id: entry.operatorId,
        title: entry.name,
        tokens: [entry.name, ...(entry.tokens || [])],
        route: `${source.url}/#q=${encodeURIComponent(entry.name)}`
      }));
    }
    case "hthp": {
      const rows = Array.isArray(payload) ? payload : [];
      return rows.map((p) => ({
        id: p.PN,
        title: p.TITLE,
        tokens: [p.PN, p.TITLE, ...(Array.isArray(p.ANCS) ? p.ANCS : []), ...(Array.isArray(p.IN) ? p.IN : [])],
        route: `${source.url}/#p=${encodeURIComponent(p.PN)}`
      }));
    }
    default:
      return [];
  }
}

export function createCrossSearch({ pinyin }) {
  function matchScore(query, tokens) {
    const q = String(query || "").toLowerCase().trim();
    if (!q) return 0;
    const qpy = pinyin(q).toLowerCase();
    let best = 0;
    for (const raw of tokens || []) {
      const t = String(raw || "").toLowerCase();
      if (!t) continue;
      if (t === q) return 100;
      if (t.startsWith(q)) best = Math.max(best, 80);
      else if (t.includes(q)) best = Math.max(best, 60);
      const tpy = pinyin(t).toLowerCase();
      if (tpy && qpy && tpy.includes(qpy)) best = Math.max(best, 45);
      if (tpy && qpy && qpy.includes(tpy) && tpy.length >= 2) best = Math.max(best, 30);
    }
    return best;
  }

  return { matchScore };
}
