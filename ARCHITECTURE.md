# Architecture

## 技术方案

- Vite + React + TypeScript：单页 Demo 成本低、启动快、适合静态部署。
- 原生 CSS：避免组件库和 Tailwind 配置成本，同时保留设计令牌。
- localStorage Repository：在浏览器保存偏好、收藏与投递状态。
- 纯函数匹配引擎：基于方向、技能、行业、地点、校招条件、新鲜度和目标公司生成可解释得分。

## 目录

```text
src/
├── components/     页面与通用组件
├── data/           虚构演示岗位和默认偏好
├── lib/            匹配、筛选、存储
├── types/          领域类型
├── App.tsx         页面状态与路由壳
└── styles.css      设计系统和响应式样式
```

## 数据模型

- `Job`：岗位公共信息、标签、时间与来源。
- `Profile`：方向、行业、地点、技能、届别及排除词。
- `UserJobState`：收藏、投递状态、更新时间和备注。
- `MatchResult`：总分、分项得分、理由与缺口。

## 状态与持久化

URL 查询参数保存当前页面；本地 Repository 使用带版本号的键保存 Profile 与 UserJobState。损坏数据会回退默认值。所有计算均在本地完成，不发送数据。

## 后续集成点

保持 `loadState/saveState` 访问边界；生产版可将其替换为 Supabase Repository。采集、去重、定时同步和 CSV 导入属于 v1，不进入本次可交互 v0。
