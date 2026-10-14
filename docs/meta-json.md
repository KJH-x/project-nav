# 项目导航元数据

`meta.json` 只描述导航站自身，不再声明跨站搜索入口或内容深链。

```json
{
  "schemaVersion": 1,
  "site": "project-nav",
  "siteName": "KJH-x 项目画廊",
  "version": "2026.10.14",
  "generatedAt": "2026-10-14T00:00:00.000Z",
  "updated": "2026-10-14",
  "counts": {
    "projects": 19,
    "public": 13,
    "local": 4,
    "wip": 2,
    "featured": 5
  },
  "notes": "视觉画廊导航；搜索仅过滤本页项目数据。"
}
```

## 字段约定

- `schemaVersion`：元数据格式版本。
- `site` / `siteName`：稳定标识和展示名称。
- `version` / `updated`：站点内容版本与更新日期，日期采用 `YYYY-MM-DD`。
- `generatedAt`：生成或核对元数据的 ISO 8601 时间。
- `counts`：与 `projects.json` 同步的收录统计。
- `notes`：面向维护者的简短说明，不承载运行时功能。

项目级字段以根目录 `projects.json` 和 `project-data.js` 为准。
