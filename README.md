# 秋招雷达 v1

一个本地优先、零账号、零数据库成本的真实岗位发现与投递管理工具。

> v0 虚拟数据 Demo 已固化在 Git tag [`v0.1.0`](https://github.com/Reiko2002/autumn-job-radar/tree/v0.1.0)，可随时查看或回退。当前 `main` 为 v1 真实数据版。

## Demo 介绍

秋招雷达是一款面向应届生的岗位发现与投递管理工具。它会根据用户设定的岗位方向、行业、城市、毕业年份和技能标签，对岗位生成可解释的匹配分，并把岗位搜索、收藏和投递进度管理串成一个完整流程。

当前版本可以体验：真实岗位搜索与组合筛选、匹配理由与能力缺口、岗位收藏、投递看板，以及修改求职意向后实时重算推荐结果。所有个人偏好和操作记录只保存在浏览器本地，不需要注册账号。

### v0 为什么使用虚拟数据？

v0 产品验证阶段使用了虚构公司和岗位数据，主要原因是：

1. 先用最低开发成本验证“个性化匹配—收藏—投递管理”主流程是否真正有用。
2. 不同招聘网站的页面结构、访问规则和反爬策略差异较大，直接抓取可能涉及服务条款、robots.txt、验证码和访问频率等合规问题。
3. 真实岗位会频繁更新、下线或改变截止时间；在同步、去重和失效判断机制完善前接入，容易向用户展示过期或错误信息。
4. 真实数据接入还需要数据库、定时任务、错误日志和数据源维护，会显著提高首版成本。

v1 已接入企业官方公开 Greenhouse、Lever API 和用户主动 CSV，并补充每日同步、岗位去重和失效检测。不会绕过登录、验证码或招聘网站的访问限制。

## 真实数据来源

- Anthropic 官方 Greenhouse Job Board API。
- Palantir 官方 Lever Postings API。
- `data/manual_jobs.csv` 中由维护者确认的企业官方岗位链接。

岗位可能随时变化，以企业官方招聘页面为准。本站只做信息聚合，不代表企业招聘承诺；所有投递最终在来源页面完成。

## 功能

- 真实岗位静态 JSON 与规则化匹配分
- 关键词、方向、城市、匹配度、校招筛选和排序
- 可解释的推荐理由与能力缺口
- 收藏和刷新后持久化
- 六阶段投递看板与状态更新
- 求职偏好配置并立即重算岗位匹配
- 桌面和移动端响应式布局

> 所有公司、岗位和投递链接均为虚构演示内容，不代表真实招聘。

## 本地启动

需要 Node.js 20+ 与 pnpm。

```bash
pnpm install
pnpm dev
```

浏览器打开终端显示的本地地址（通常为 `http://localhost:5173`）。首次运行不需要 `.env`、Supabase 或任何外部账号。

## 质量检查

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 数据说明

公开岗位存储在 `public/data/jobs.json`；偏好、收藏和投递状态保存在浏览器 `localStorage`，并只通过稳定岗位 ID 关联。

## 同步真实岗位

安装 Python 3.12 后：

```bash
python -m venv .venv
.venv/bin/pip install -r scripts/requirements.txt
.venv/bin/python -m pytest scripts/tests -q
.venv/bin/python -m scripts.sync_jobs
```

同步会先读取上一版 JSON，只有所有质量闸门通过才会原子替换正式数据。

### 手动添加官方岗位

1. 编辑 `data/manual_jobs.csv`，保留现有 Header。
2. 必填 `company`、`title` 和 `source_url`；多值字段用 `|` 分隔。
3. 链接必须来自企业官方招聘页或经过确认的真实岗位页。
4. 运行 `.venv/bin/python -m scripts.sync_jobs` 并检查 `public/data/jobs.json`。

### 添加 Greenhouse / Lever 公司

在 `config/sources.yaml` 新增配置。Greenhouse 填写公开 `board_token`，Lever 填写公开 `site_slug`，确认 API 可访问后再设为 `enabled: true`。不接入需要账号、Cookie、验证码或禁止自动访问的来源。

## 自动同步

GitHub Actions 每天 UTC 01:20（北京时间 09:20）自动运行，也可在仓库 Actions → “Sync real jobs and deploy Pages” → Run workflow 手动触发。流程会执行 Python 测试、数据同步与质量检查、JSON 持久化、前端检查、构建和 Pages 部署。

同步失败时查看 Actions 日志和 `public/data/sync-meta.json`。不要手工删除上一版数据；质量保护会在全部源失败、空输出或 active 岗位异常下降时拒绝覆盖。

## 静态部署

运行 `pnpm build` 后，将 `dist/` 部署到 Vercel、Cloudflare Pages、Netlify 或任意静态服务器即可。构建命令为 `pnpm build`，输出目录为 `dist`。

仓库内置 GitHub Pages 工作流。推送到 `main` 后，在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**，即可自动构建并发布。

## 下一版本建议

1. 增加手动岗位表单与 CSV 预览导入。
2. 抽象 Repository 并接入 Supabase Auth/RLS。
3. 在合规前提下增加 Greenhouse / Lever 公开 API 适配器。
4. 增加同步日志、去重与岗位失效判断。
