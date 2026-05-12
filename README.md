# project-nav

KJH-x 项目导航 — 汇总所有托管在 Cloudflare Pages 上的公开项目。

## 技术栈

纯静态页面：HTML + CSS + JavaScript，部署于 Cloudflare Pages。

## 项目列表

| 项目 | 域名 | 类型 |
|------|------|------|
| G-NCNS | ncns.nsapi.top | game |
| Arknights Operator Acrylic Keys | aak.nslc.top | game |
| Card Page | bz.nslc.top | archive |
| CLS Page | cls.nslc.top | archive |
| Echoes of Terra | echos.nslc.top | game |
| Icon Gallery | icon.nslc.top | tool |
| MAA Status | maa.nslc.top | tool |
| Noise Image | ni.nslc.top | tool |
| Cal4Rouge | rgc.nslc.top | game |
| Script Gallery | script.nslc.top | tool |

## 改进路线图

| # | 维度 | 类型 | 说明 | 状态 |
|---|------|------|------|------|
| 1 | 搜索与全文过滤 | 体验 | 即时搜索栏，支持按名称、标签、描述、域名过滤 | done |
| 2 | 分类/标签筛选 | 体验 | 可点击的标签分类芯片（game、tool、design 等） | done |
| 3 | 数据外置 JSON | 可维护性 | 将 projects[] 移至 projects.json，运行时 fetch 加载 | done |
| 4 | 无障碍审计 | 体验 | 键盘导航、焦点管理、skip-to-content、ARIA 增强 | done |
| 5 | 安全头与 CSP | 安全 | Cloudflare Pages `_headers` 文件，强制 CSP/HSTS/内容类型 | done |
| 6 | 拼音搜索 | 体验 | 支持输入拼音（如 `shuiyin`）匹配中文项目名（参考 script-gallery） | done |
| 7 | 错误边界与兜底 | 健壮性 | JSON 加载失败时显示骨架/占位卡片 | done |

## 许可

MIT License — 详见 [LICENSE](LICENSE)。
