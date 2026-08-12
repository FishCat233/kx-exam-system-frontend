# KX Exam System — Frontend

C 语言在线考试系统的前端，考生端 + 管理后台，React 19 + TypeScript。

## 特性

- **力扣风格考试界面**：左侧题目、右侧 C 语言编辑器、顶部状态栏
- **全屏预检**：登录后强制进入浏览器全屏，并持续守卫
- **隐形监控**：静默监听切屏与退出全屏，不向考生展示任何提示
- **管理后台**：仪表盘、考生管理、题目管理、考试设置、阅卷导出
- **同源部署**：Caddy 反代 API 与 WebSocket，浏览器只访问一个端口

## 快速开始

环境要求：Node.js >= 20、pnpm >= 9。

```bash
pnpm install      # 安装依赖
pnpm dev          # 启动开发服务器
```

开发服务器默认 http://localhost:5173，通过 Vite 代理转发 API 到 8000 端口。

```bash
npx tsc --noEmit            # 类型检查
npx prettier --write .      # 格式化
npx eslint .                # 代码检查
```

## 部署

前端随系统整体部署，编排在后端仓库的 `docker-compose.yml` 中。镜像由 release-please 发版时自动构建推送到 GHCR，Caddy 容器将 `/api` 与 `/ws` 反代到 backend。

## 文档

- [术语表](../CONTEXT.md)
- [项目架构](../docs/architecture.md)
- [页面与功能](../docs/frontend/pages.md)
- [视觉设计规范](../docs/frontend/design.md)
- [前端开发规则](../docs/frontend/rules.md)

## License

MIT
