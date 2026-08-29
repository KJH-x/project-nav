# 跨站深链 / URL 约定（deep-links）

> 仓库：project-nav（导航中心） · 建立：2026-08-29 · 来源：`feature-audit-20260829/CROSS_REPO_INTEGRATION.md`（B1/B3 节）
> 本文件是跨站「内容单元级深链」的权威约定文档，供 nav 页面、各站点（aak / cls / hthp / ak-reader）落地与对照使用。

## 0. 一句话

所有站点统一：**导航级视图/筛选态用 `hash`，独立子页面用 `path`；token 规则以 aak 的 `boxToToken` 为基准；导航页搜索/直达建议产出的结果一律是可直接跳转的深链（X-C2）。**

---

## 1. 两种形态分工

| 形态 | 用途 | 示例 | 各站支持情况 |
|------|------|------|--------------|
| `hash` | 视图/筛选态（同页面内切换、复制分享） | `#52`、`#q=凯尔希`、`#p=CN101018931A`、`#L120` | aak ✅（基准）、hthp ✅、CLS 部分（`#id-{id}`）、ak-reader 待落地（`#L{n}`） |
| `path` | 独立子页面（可被直接链接/索引） | `/story/main/0/0-1-beg/`、`/to/{account}/{slug}/`、`/52` | aak ✅（`/52`）、CLS ✅（四路由 + `/to/*`）、ak-reader ✅（`/story/.../`）、hthp —（无独立子页） |

落地依赖各站 `_redirects` 的 SPA catch-all（aak `_redirects:1`、CLS `_redirects:9` 均已具备；hthp 为静态无 SPA，hash 已足够）。

## 2. token 规则（以 aak `boxToToken` 为基准）

参考实现：`ak_operator_list/src/lib/router.ts:37-41`（`boxToToken`）、`26-35`（`tokenToBoxId`）、`136-156`（`buildRouteHash`）。

1. **数字 token**：数字盒 id 去掉 `.0` 后缀（`52.0` → `52`），匹配 `/^\d+(?:\.0)?$/`。
2. **非数字 token**：用 `encodeURIComponent` 编码全名（特殊盒、角色名、活动 slug 等）。
3. **多 token**：以 `+` 连接（`#1+54` = 首末盒）。
4. **保留字**：`none`（空选择）、前缀 `type=` / `q=` / `p=`（载荷）。`type=` 五类取值：`numeric / ambience / cooperation / special / whitelist`。
5. **跨站跳转统一语法**：`https://<domain>/#<token>` 或 `https://<domain>/<path>`。导航页、`BOX_CHARACTERS.md`、CLS 卡片「复制链接」均输出此格式。

## 3. 各站深链现状与落地清单

| 站点 | 深链现状 | 深链示例 | 状态 |
|------|----------|----------|------|
| **aak**（aak.nslc.top） | hash+path 双形态完整（盒路由） | `#52`、`#1+54`、`#type=ambience`、`#q=凯尔希`、`/52` | ✅ 基准（已落地） |
| **CLS**（cls.nslc.top） | path 四路由 + `/to/{account}/{slug}/` + `#id-{id}`；R2 `/to/` 已提交（2026-08-29，commit `789cf2b`，ef slug 提取已修复，客户端 `buildSlug` 推导） | `/ak/`、`/ak-figures/`、`/ef/`、`/ef-figures/`、`/to/ak/{slug}/`、`/to/ef/{slug}/` | 🟡 代码已落地，**部署未确认** → 导航 chip 标 `wip` |
| **hthp**（hthp-patent.pages.dev） | hash 状态同步完整：`q/y/d/a/i/l/c/s/o/ps/pg/v/p` 字段（`app.js:791-833`） | `#q=热泵`、`#p=CN101018931A` | ✅ hash 已落地（无独立子页） |
| **ak-reader**（ak-reader.pages.dev，公网未确认） | 故事路由 `/story/{category}/{activityCode}/{id}/`；**行级锚点未实现**（ROADMAP #2 计划 `#L{lineNumber}`） | `/story/main/0/0-1-beg/` | 🟡 行锚点待落地（#2） |

落地顺序建议：aak（已有）→ CLS R2 `/to/`（已提交待部署；部署确认后把导航 `routes[]` / `deepLinks` 中 CLS 的 `/to/` chip 从 `wip` 转稳定）→ hthp 保持 → ak-reader #2 行锚点。

## 4. 复制 / 分享 / toast 交互约定（X-B3，以 aak 为试点）

统一「复制深链」交互：

1. **按钮**：复制按钮调用 `navigator.clipboard.writeText('https://<domain>/#<token>')`。
2. **toast 反馈**：复制成功后显示 toast（aak `App.vue:36-40 showToast` 是现成范式）：「已复制链接」。
3. **入站解析**：统一在 **页面 load + hashchange 两处**接线解析（aak `App.vue:146-190` 是完整参考；hthp `app.js:369,1161-1165` 已实现 load+hashchange 双处解析）。
4. **长载荷**：>64KB 走 `#p=`（fflate 压缩，`share.ts:65-79`，已有 64KB 上限保护）；短载荷走普通 token。
5. **兼容性**：`navigator.clipboard` 需安全上下文（https / localhost）；失败时回退 `document.execCommand('copy')` + toast「复制失败，请手动复制」。

### 各站复制/分享对照表

| 站点 | 复制按钮 | toast | 入站解析（load+hashchange） | 备注 |
|------|----------|-------|------------------------------|------|
| aak | 🟡 盒路由跳转后段缺（`CatalogBoxRow.vue` 无「复制本盒链接」） | ✅ `showToast` | ✅ `App.vue:146-190` | 约定试点基准 |
| CLS | 🟡 Rank 2 计划（`metaRow`/lightbox 加按钮） | 无 | 🟡 部分（`#id-` 解析待修） | 依赖 Rank 2 slug 修复 |
| hthp | 🟡 #4 计划「复制当前链接」 | 无 | ✅ `app.js:369,1161-1165` | 与 #4 URL 同步同批落地 |
| ak-reader | 🟡 #2 计划行锚点可分享 | 无 | 🟡 行锚点解析待落地 | 依赖 #2 |

## 5. 结果即深链（X-C2）

导航页（本项目）的**跨站搜索与直达建议的结果项一律输出各站的深链 URL**（见 `site-index.json` / `cross-search.js`），点击即在目标站打开对应视图/条目，而非仅文本列表。落地：

- aak 命中 → `https://aak.nslc.top/#<token>` 或 `#q=<角色名>`。
- CLS 命中 → `https://cls.nslc.top/ak/`、`/ak-figures/` 等可用路由（`/to/` 待 Rank 2 修复后再引用）。
- hthp 命中 → `https://hthp-patent.pages.dev/#q=<词>` 或 `#p=<PN>`。
- ak-reader 命中 → `https://ak-reader.pages.dev/story/.../`（公网域名待确认）。

## 5.1 卡片路由深链（X-A2）

导航页卡片直接渲染各站内容级深链 chip（数据源 `projects.json` 的 `routes[]`，模板对齐 `site-index.json` 的 `deepLinks`），点击新 tab 直达；每枚 chip 附「复制链接」按钮（走 §4 的 clipboard + toast 约定）。

| 站点 | 卡片 chip 示例 | 状态 |
|------|----------------|------|
| aak | `#52`、`#1+54`、`#type=ambience`、`#q=凯尔希` | ✅ 稳定（box-routes.json） |
| CLS | `/ak/`、`/ak-figures/`、`/ef/`、`/ef-figures/`、`/to/ak/{slug}/`、`/to/ef/{slug}/` | ✅ 四路由稳定；`/to/` R2 已提交（2026-08-29 `789cf2b`）但 **cls.nslc.top 线上未含 buildSlug**，部署前标 `wip` |
| hthp | `#q=热泵`、`#p=CN101018931A` | ✅ 稳定（hash 已落地） |
| ak-reader | `/story/main/`、`/story/event/`、行锚点 `#L{n}` | 🟡 公网域名未确认 + 行锚点待落地 → 全部标记 `wip: true` |

约定：深链不稳定的条目在 `routes[]` 中标记 `wip: true`，卡片渲染为虚线 WIP 徽标样式（不隐藏，明确标注待稳定）。

## 6. CSP 与跨源取数约束（X-C1 前置）

- 导航页 `_headers` CSP 为 `default-src 'self'`（无 `connect-src`），**默认禁止跨源 fetch**。
- 各站点静态 JSON 的 CORS 现状（2026-08-29 实测）：
  - `hthp-patent.pages.dev/data/patents.json` → `Access-Control-Allow-Origin: *` ✅ 可跨源。
  - `aak.nslc.top/data/catalog.v2.json` → `ACAO: *` ✅ 可跨源。
  - `cls.r2.nsapi.top/site/search-index.json` → **无 ACAO 头** ❌ 浏览器跨源取数被 CORS 拦截。
  - ak-reader 无公网域名 → 不可取数。
- 因此 X-C1 采用「可配置数据源 URL 白名单 + 静态快照降级」策略：
  1. `cross-search.js` 内维护 `CROSS_SOURCES`（站点/索引 URL/可用性），仅对 CORS 可达源做运行时 `fetch`。
  2. 对 CORS 不可达/无域名站点，回退到 `site-index.json` 中的**本地关键词映射表**（`fallback`），保证「结果即深链」仍然成立。
  3. 若未来 CLS R2 桶开启 CORS（`Access-Control-Allow-Origin`），在 `cross-search.js` 白名单中启用即可，无需改导航页 CSP。
- 导航页自身 `_headers` 未开放 `connect-src`（保持 `default-src 'self'` 安全基线）；跨站数据一律由可配置白名单 + 静态快照处理，不向任意源开放连接。
