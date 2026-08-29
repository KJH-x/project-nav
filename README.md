# project-nav

KJH-x 项目导航 — 汇总所有托管在 Cloudflare Pages 上的公开项目。

## 技术栈

纯静态页面：HTML + CSS + JavaScript，部署于 Cloudflare Pages。

## 项目列表

| 项目 | 域名 | 类型 |
| ------ | ------ | ------ |
| G-NCNS | ncns.nsapi.top | game |
| Arknights Operator Acrylic Keys | aak.nslc.top | game |
| Card Page | bz.nslc.top | tool |
| CLS Page | cls.nslc.top | archive |
| Echoes of Terra | echos.nslc.top | game |
| HTHP Patent | hthp-patent.pages.dev | tool |
| Icon Gallery | icon.nslc.top | tool |
| MAA Status | maa.nslc.top | tool |
| Noise Image | ni.nslc.top | tool |
| Cal4Rouge | rgc.nslc.top | game |
| MD Editor | md.nslc.top | tool |
| Script Gallery | script.nslc.top | tool |
| AK Reader | ak-reader.pages.dev | tool |
| Files | files.nslc.top | selfhost |
| NapCat WebUI | napcat.nslc.top | selfhost |
| VueTorrent | qbit.nslc.top | selfhost |
| Video Resource Search | av.nsapi.top | selfhost |

> AK Reader 公网部署待定（2026-08-29 审计未确认域名，见 `docs/deep-links.md`）。

## 跨站约定与文档

| 文档 | 内容 |
| ------ | ------ |
| `docs/deep-links.md` | 跨站深链 / URL 约定（X-B1）+ 复制/分享/toast 约定（X-B3）+ 结果即深链（X-C2）+ CSP/跨源取数约束（X-C1） |
| `docs/meta-json.md` | 站点 `meta.json` 元数据约定（X-B4）与各站模板 |
| `docs/lightbox.md` | 共享 lightbox / 查看器行为契约（X-D1） |

## 数据文件

- `projects.json` — 站点收录（含深链相关字段透传，`routes[]` 为卡片深链 chip，`wip` 标记待稳定深链）。
- `site-index.json` — 直达建议 + 跨站检索的站点索引与本地关键词映射表（X-A4 / X-C1 降级源）；含 `updated`/`version` 供每站「最新」徽标（X-A3）。
- `meta.json` — 导航页自身元数据（X-B4 试点，schema 见 `docs/meta-json.md`）。
- `cross-search.js` — 客户端跨站搜索（CORS 白名单 fetch + 本地映射降级，见 `docs/deep-links.md` §6）。

## 改进路线图

| # | 维度 | 类型 | 说明 | 状态 |
| --- | ------ | ------ | ------ | ------ |
| 1 | 搜索与全文过滤 | 体验 | 即时搜索栏，支持按名称、标签、描述、域名过滤 | done |
| 2 | 分类/标签筛选 | 体验 | 可点击的标签分类芯片（game、tool、design 等） | done |
| 3 | 数据外置 JSON | 可维护性 | 将 projects[] 移至 projects.json，运行时 fetch 加载 | done |
| 4 | 无障碍审计 | 体验 | 键盘导航、焦点管理、skip-to-content、ARIA 增强 | done |
| 5 | 安全头与 CSP | 安全 | Cloudflare Pages `_headers` 文件，强制 CSP/HSTS/内容类型 | done |
| 6 | 拼音搜索 | 体验 | 支持输入拼音（如 `shuiyin`）匹配中文项目名（参考 script-gallery） | done |
| 7 | 错误边界与兜底 | 健壮性 | JSON 加载失败时显示骨架/占位卡片 | done |
| 8 | 直达建议 + 跨站检索 | 体验 | 搜索框直达站点/深链建议；对 CORS 可达源做客户端跨站检索，结果为深链（X-A4/X-C1/X-C2） | done |
| 9 | 键盘/移动端一致性 | 体验 | `/` 聚焦搜索、Esc 清空、方向键卡片间移动；移动端跨站面板横向滚动 | done |
| 10 | 卡片路由深链 | 体验 | 每卡渲染内容级深链 chip（routes[]，如 aak `#52`、CLS `/ak/`、hthp `#q=`、ak-reader `/story/`）+ 复制链接按钮（X-A2，wip 标记待稳定深链） | done |
| 11 | 每站最新/更新时间徽标 | 体验 | 依据 `site-index.json` 的 `updated`/`version` 渲染「更新 YYYY-MM-DD」徽标；无部署时间戳的站点隐藏徽标（X-A3） | done |
| 12 | 主题一致性（表层对齐） | 一致 | 新增语义 token 别名（`--c-bg/fg/accent/surface/muted`），与其它站点的 data-theme 明暗处理对齐（X-A6） | done |

## 许可

MIT License — 详见 [LICENSE](LICENSE)。
