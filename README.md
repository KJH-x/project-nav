# project-nav

KJH-x 项目画廊：汇总公开工具、互动作品、内容归档、内网服务与开发中项目。

站点是纯静态 HTML / CSS / JavaScript，部署于 Cloudflare Pages。项目搜索只读取本仓库的 `projects.json`，不会抓取其他站点数据。

## 当前收录

| 范围 | 数量 | 说明 |
| --- | ---: | --- |
| 公网项目 | 13 | 可从公开入口访问 |
| 内网与自托管 | 4 | 依赖特定网络或本地服务 |
| 开发中 | 2 | 入口或功能尚未稳定 |
| 合计 | 19 | 其中 5 个精选项目 |

精选项目为 Campus Shuttle Board、CLS Page、Script Gallery、Icon Gallery 与 Liquid Metal Laptops。

## 视觉与图标

- 视觉语言延续 BitBus：暖色背景、扁平几何、粗圆角和高对比。
- 有正式图标的项目复用原资产，不做重绘。当前 BitBus 与 MD Editor 的 PNG 均从源项目原样复制；HTHP 保留原有 emoji favicon。
- 无正式图标的项目使用 `assets/icons/custom/` 下的站内 SVG。
- UI 操作图标集中在 `assets/icons/ui.svg`，导航品牌标识为 `assets/icons/custom/nav-mark.svg`。
- 项目封面由 CSS 构成，不依赖站点截图或远程图像。

## 数据文件

- `projects.json`：项目名称、入口、仓库、图标、封面语义字、简介、标签、类型、范围、精选状态和更新时间。
- `meta.json`：导航站自身版本与收录数量。
- `project-data.js`：项目 URL、图标路径、日期和基础字段校验。

项目卡只提供主页与 GitHub 入口，不提供内容深链、跨站检索或链接复制。

## 本地验证

```powershell
node --test tests/*.test.mjs
```

本地预览可使用任意静态服务器，例如：

```powershell
python -m http.server 8788
```

然后访问 `http://localhost:8788/`。

## 维护约定

1. 优先从对应本地仓库 README、manifest 或 meta 文件更新项目说明。
2. 已有项目图标只复制使用，不修改源文件。
3. 没有正式图标时，新增与 BitBus 风格一致的本地 SVG。
4. 新增或删除项目时同步更新 `meta.json` 的计数和测试锚点。
5. 不收录 R2 资源域名、隧道入口（nc2 / ab2）或尚无远程展示入口的项目。

## 许可

MIT License — 详见 [LICENSE](LICENSE)。
