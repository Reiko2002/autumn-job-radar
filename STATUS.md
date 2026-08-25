# Status

## 当前目标

交付可本地运行的秋招雷达 v0，打通“发现岗位—解释匹配—收藏—投递状态—偏好重算”闭环。

## 本次最小改动

- 新建独立 Vite 项目，不修改工作区现有求职资料。
- 使用虚构 Demo 数据与 localStorage，不引入账号、数据库或外部 API。
- 完成响应式桌面/移动体验和核心业务单元测试。

## 已知约束

- 所有岗位和链接均为演示内容，不代表真实招聘。
- v0 不承诺真实采集和多用户能力。

## 进度

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
