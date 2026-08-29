# Status · v1

## 当前目标

在保留 v0 UI 和交互的前提下，接入低成本真实岗位数据管线并每日自动更新。

## 本次最小改动

- 新建独立 Vite 项目，不修改工作区现有求职资料。
- 使用虚构 Demo 数据与 localStorage，不引入账号、数据库或外部 API。
- 完成响应式桌面/移动体验和核心业务单元测试。

## 已知约束

- 所有岗位和链接均为演示内容，不代表真实招聘。
- v0 不承诺真实采集和多用户能力。

## 进度

- [x] v0 固化为 `v0.1.0` Git tag
- [x] Static JSON Repository 与加载/错误/缓存状态
- [x] CSV、Greenhouse、Lever Adapter
- [x] 标准化、稳定 ID、去重、状态机、质量闸门
- [x] Anthropic Greenhouse 与 Palantir Lever 真实数据源
- [x] 662 条真实岗位初次同步
- [x] v1 完整质量闸门与本地浏览器验收

## v1 验证结果

- 前端 lint：pass
- TypeScript：pass
- 前端测试：4/4 pass
- Python 测试：5/5 pass
- 生产构建：pass
- 真实同步：878 条原始岗位 → 662 条去重 active 岗位
- 数据源：Anthropic Greenhouse、Palantir Lever、人工 CSV，3/3 成功
- 390px 移动端：无横向溢出
- 官方投递链接：pass
- 浏览器控制台错误：0

- [x] PRD、验收标准、视觉方向和技术边界
- [x] 轻量架构与开发规范
- [x] 可交互主流程
- [x] 质量闸门：lint / typecheck / 2 tests / production build
- [x] 浏览器验收：桌面、390px 移动端、搜索、详情、收藏持久化

## 验证结果

- lint: pass
- typecheck: pass
- unit test: pass（2/2）
- build: pass
- desktop UI: pass
- mobile overflow: pass（390px，scrollWidth = innerWidth）
- console errors: 0

## 后续范围

手动/CSV 导入、Supabase、真实公开数据源适配器、自动同步和生产鉴权放入 v1。Git 检查点未创建：当前仓库包含大量与本项目无关的未跟踪求职资料，避免把用户文件意外纳入提交。
