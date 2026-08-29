# 共享 lightbox / 查看器行为契约（X-D1）

> 仓库：project-nav · 建立：2026-08-29 · 来源：`CROSS_REPO_INTEGRATION.md`（D1 节）
> 非共享代码（各站零依赖约束），只共享**行为规范**，避免各站出现互斥交互。

## 1. 契约基线（以 CLS `viewer.js` 为基准）

任何全屏图片/内容查看器（lightbox / 详情弹层）必须实现：

| 行为 | 规范 | 参考实现 |
|------|------|----------|
| 打开 | 遮罩 + 居中内容，聚焦圈定（focus trap） | `viewer.js:475-494` |
| 关闭 | **Esc** 关闭；点遮罩背景关闭；右上角关闭按钮 | CLS `viewer.js` |
| 前后导航 | **← / →** 方向键切换上/下一条（仅多条目场景） | CLS `viewer.js` |
| 焦点管理 | 打开时焦点入查看器；关闭时**归还焦点**到触发元素；`aria-modal="true"` | CLS `viewer.js` |
| 信息条 | 动态标题 / 原始尺寸 / 原动态链接（可选，Rank 3 计划） | CLS Rank 3 |
| 复制链接 | 复制当前条目深链（见 `docs/deep-links.md` §4） | CLS Rank 2 / aak `#p=` |
| 下载 | 下载按钮（若站点支持，见 D2 导出约定） | — |
| 缩略条 | 缩略图横条（点按跳转），小图加载避免拉原图 | CLS Rank 3（`smallThumbKey`） |

## 2. 各站现状对照表

| 站点 | 查看器 | Esc | ←/→ | 焦点圈定 | 信息条 | 复制链接 | 下载 | 备注 |
|------|--------|-----|------|----------|--------|----------|------|------|
| CLS | ✅ `viewer.js`（完整） | ✅ | ✅ | ✅ | 🟡 Rank 3 计划 | 🟡 Rank 2 计划 | ✅ viewer 下载 | 基准 |
| hthp | 🟡 详情为模态（`index.html:76-81`、`app.js:373-409`），非 lightbox | ✅ | — | 部分 | ✅ 元数据 | 🟡 #4 计划 | 🟡 #4 计划 | 模态无 ←/→ |
| md-editor | 🟡 #8 计划从零加图片 lightbox | 计划 | 计划 | 计划 | — | — | — | 与契约对齐实现 |
| aak | —（图为小头像，无查看器） | — | — | — | — | ✅ `#p=` 分享 | — | 不适用 |
| ak-reader | —（纯文本阅读站） | — | — | — | — | 🟡 #2 行锚点分享 | 🟡 #2 导出整章 | 不适用 |

## 3. 统一约定要点（任何新实现必须遵守）

1. **Esc 优先**：任何弹层/查看器打开时，Esc 必须可关闭（即使页面有其它 Esc 逻辑，弹层打开期间应拦截）。
2. **←/→ 仅在有上下条时启用**；单条目不得占用方向键。
3. **焦点不泄漏**：打开即 trap 焦点；关闭即归还触发元素（`viewer.js:475-494` 模式）。
4. **帧策略一致**：所有站点 `_headers` 均 `X-Frame-Options: DENY` / `frame-ancestors 'none'`（CLS `_headers:1-6`、aak `_headers:2`、nav `_headers:2`），禁止被 iframe 嵌入。
5. **复制/下载**：遵循 `docs/deep-links.md` §4（toast + clipboard）与 D2 导出约定（CSV UTF-8 BOM、包内 `manifest.json` 复用 `meta-json.md` §2）。

## 4. 落地清单

| 项 | 归属 | 状态 |
|----|------|------|
| CLS lightbox 信息条 + 复制链接 | CLS Rank 3 / Rank 2 | ⬜ 待做 |
| hthp 详情弹层对齐（Esc/焦点/复制链接） | hthp #4 / #7 | ⬜ 待做 |
| md-editor 图片 lightbox | md-editor #8 | ⬜ 待做 |
