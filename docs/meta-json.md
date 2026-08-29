# meta.json 站点元数据约定（X-B4）

> 仓库：project-nav · 建立：2026-08-29 · 来源：`CROSS_REPO_INTEGRATION.md`（B4 节）

## 1. 目标

为所有静态站点提供一个**统一、轻量、独立**的元数据端点，供导航页徽标（A3）、跨站索引版本校验（C 节）、数据血缘（D4）共用。现状各站格式不统一、无独立轻量端点：

| 站点 | 现有元数据 | 问题 |
|------|-----------|------|
| aak | 工作区 `data/metadata.json`（`generated_at/source_sha256/counts`） | 站点侧只有 1MB `catalog.v2.json`，无独立轻量端点 |
| hthp | `stats.json.updated` | 字段少、不独立 |
| ak-reader | `manifest.json.generatedAt` | 混在 1.18MB manifest 中 |
| CLS | `index.json.generatedAt` | 未独立 |

## 2. Schema（固定）

统一产出 `public/data/meta.json`（或站点根 `/meta.json`）：

```json
{
  "schemaVersion": 1,
  "site": "<site-id>",
  "siteName": "<显示名>",
  "version": "<站点自身版本/构建号>",
  "generatedAt": "<ISO-8601 UTC 生成时间>",
  "updated": "<YYYY-MM-DD 最近数据更新>",
  "sourceHash": "<可选：源数据 SHA-256>",
  "deepLink": {
    "base": "https://<domain>/",
    "formats": {
      "box": "https://<domain>/#<token>",
      "story": "https://<domain>/story/{category}/{code}/{id}/",
      "patent": "https://<domain>/#p={PN}"
    }
  },
  "searchEntry": "https://<domain>/#q={query}",
  "counts": { "<任意计数键>": <数字> },
  "notes": "<可选：版权/维护说明>"
}
```

必填：`schemaVersion / site / siteName / generatedAt / updated / searchEntry`；可选：`sourceHash / deepLink / counts / notes / version`。

### 各站 counts 建议口径（以实际数据为准，2026-08-29 实测）

| 站点 | counts |
|------|--------|
| aak | `{boxes:92, numericBoxes:54, specialBoxes:38, characterMemberships:577, stateVariants:1117, operators:431}` |
| hthp | `{patents:641, families:610}` |
| ak-reader | `{stories:1522, activities:101, duplicates:459}` |
| CLS | `{totalDynamics:?, totalImages:?}`（取自 `index.json`） |

## 3. 本仓库试点

本仓库已生成自身 `meta.json`（见仓库根目录）：

```json
{
  "schemaVersion": 1,
  "site": "project-nav",
  "siteName": "KJH-x 项目导航",
  "version": "2026.08.29",
  "generatedAt": "2026-08-29T00:00:00.000Z",
  "updated": "2026-08-29",
  "deepLink": { "base": "https://nav.nslc.top/", "formats": { "search": "https://nav.nslc.top/?q={query}" } },
  "searchEntry": "https://nav.nslc.top/?q={query}",
  "counts": { "projects": 17, "public": 11, "local": 4, "wip": 2 }
}
```

## 4. 其它站点模板（复制到各站构建脚本，随发布生成）

### aak（`ak_operator_list`）
```json
{
  "schemaVersion": 1,
  "site": "aak",
  "siteName": "Arknights Operator Acrylic Keys",
  "version": "2",
  "generatedAt": "<catalog.v2.json.generatedAt>",
  "updated": "<generatedAt 日期>",
  "sourceHash": "<catalog.v2.json.sourceHash>",
  "deepLink": { "base": "https://aak.nslc.top/", "formats": { "box": "https://aak.nslc.top/#<token>" } },
  "searchEntry": "https://aak.nslc.top/#q={query}",
  "counts": { "boxes": 92, "characterMemberships": 577, "stateVariants": 1117 }
}
```

### hthp（`hthp-patent`）
```json
{
  "schemaVersion": 1,
  "site": "hthp-patent",
  "siteName": "高温热泵专利情报库",
  "version": "1",
  "generatedAt": "<stats.json 导出时间>",
  "updated": "<stats.json.updated>",
  "deepLink": { "base": "https://hthp-patent.pages.dev/", "formats": { "patent": "https://hthp-patent.pages.dev/#p={PN}" } },
  "searchEntry": "https://hthp-patent.pages.dev/#q={query}",
  "counts": { "patents": 641, "families": 610 }
}
```

### ak-reader
```json
{
  "schemaVersion": 1,
  "site": "ak-reader",
  "siteName": "明日方舟剧情阅读站",
  "version": "1",
  "generatedAt": "<manifest.json.generatedAt>",
  "updated": "<generatedAt 日期>",
  "deepLink": { "base": "https://ak-reader.pages.dev/", "formats": { "story": "https://ak-reader.pages.dev/story/{category}/{code}/{id}/" } },
  "searchEntry": "https://ak-reader.pages.dev/",
  "counts": { "stories": 1522, "activities": 101, "duplicates": 459 }
}
```

### CLS
```json
{
  "schemaVersion": 1,
  "site": "cls-page",
  "siteName": "明日方舟周边图片归档",
  "version": "1",
  "generatedAt": "<index.json.generatedAt>",
  "updated": "<generatedAt 日期>",
  "deepLink": { "base": "https://cls.nslc.top/", "formats": { "account": "https://cls.nslc.top/{account}/", "to": "https://cls.nslc.top/to/{account}/{slug}/" } },
  "searchEntry": "https://cls.nslc.top/",
  "counts": { "totalDynamics": 0, "totalImages": 0 }
}
```

## 5. 落地清单

| 站点 | 落地 | 备注 |
|------|------|------|
| project-nav | ✅ 已生成（本仓库） | 试点 |
| aak | ⬜ 待建 | `scripts/refresh.mjs` 增发 `public/data/meta.json` |
| hthp | ⬜ 待建 | `export_site_data.ps1` 增发 |
| ak-reader | ⬜ 待建 | `build-content.ts` 增发 |
| CLS | ⬜ 待建 | `collect.py` 增发 |
