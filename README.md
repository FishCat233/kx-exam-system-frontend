# KX Exam System — Frontend

C 语言在线考试系统前端，基于 React 19 + TypeScript + Vite 构建。

## 技术栈

- **UI 框架**：React 19
- **语言**：TypeScript
- **构建工具**：Vite
- **路由**：React Router v7
- **状态管理**：zustand
- **CSS 方案**：UnoCSS（原子化 CSS）
- **组件库**：Ant Design（仅限后台管理页）
- **代码编辑器**：CodeMirror（C 语言语法高亮）
- **Markdown 渲染**：react-markdown + remark-gfm
- **全屏 API**：screenfull
- **包管理**：pnpm

## 快速开始

### 环境要求

- Node.js >= 20
- pnpm >= 9

### 安装与运行

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (http://localhost:5173)
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

### 代码质量

```bash
pnpm lint              # ESLint 检查
pnpm lint:fix          # ESLint 自动修复
pnpm format            # Prettier 格式化
pnpm format:check      # 检查格式（CI 用）
```

### 类型检查

```bash
npx tsc --noEmit       # TypeScript 类型检查
```

## 项目结构

```
xmn-exam-system-frontend/
├── src/
│   ├── main.tsx              # 应用入口
│   ├── App.tsx               # 根组件，路由配置
│   ├── pages/                # 页面组件
│   │   ├── LoginPage.tsx     # 考生登录页（学号+姓名+登录码+承诺书）
│   │   ├── MainPage.tsx      # 考试主页面（力扣风格布局）
│   │   ├── AdminLoginPage.tsx # 管理登录页
│   │   ├── DashboardPage.tsx  # 仪表盘
│   │   ├── StudentListPage.tsx # 考生列表
│   │   └── ...               # 其他管理页面
│   ├── components/           # 可复用组件
│   │   ├── StatusBar.tsx     # 顶部状态栏（倒计时/连接状态/交卷）
│   │   ├── ProblemPanel.tsx  # 左侧题目区（Markdown 渲染）
│   │   ├── CodeEditor.tsx    # 右侧代码编辑器（CodeMirror）
│   │   └── ...
│   ├── stores/               # zustand 状态管理
│   ├── api/                  # API 请求模块
│   ├── hooks/                # 自定义 Hooks
│   └── utils/                # 工具函数
├── public/                   # 静态资源
├── scripts/                  # 构建/部署脚本
├── package.json              # 项目配置与依赖
├── vite.config.ts            # Vite 配置
├── uno.config.ts             # UnoCSS 配置
├── tsconfig.json             # TypeScript 配置
├── eslint.config.js          # ESLint 配置
└── Dockerfile                # Docker 构建文件
```

## 页面概览

### 考生端

| 页面 | 路由 | 说明 |
|------|------|------|
| 登录页 | `/` | 学号 + 姓名 + 登录码 + 考前承诺书 + 全屏预检 |
| 考试主页面 | `/exam` | 力扣风格布局：左侧题目 + 右侧编辑器 + 顶部状态栏 |

**隐形监控**：页面静默监听 `visibilitychange` 和 `fullscreenchange` 事件，通过 WebSocket 实时上报切屏/退出全屏行为，不对考生展示任何 UI 提示。

### 管理端（`/admin`）

| 页面 | 路由 | 说明 |
|------|------|------|
| 管理登录 | `/admin/login` | 账号密码登录 |
| 仪表盘 | `/admin/dashboard` | 考试状态、倒计时、人数、最近异常 |
| 考生管理 | `/admin/students` | 考生列表、详情、强制收卷 |
| 考题管理 | `/admin/problems` | 编程题 + 选择题的增删改查 |
| 考试设置 | `/admin/exams` | 考试信息管理 |
| 账号管理 | `/admin/account` | 修改密码（超级管理员可管理其他账号） |

## 设计规范

- **配色**：白色背景，蓝色强调色
- **布局**：100vw × 100vh 全屏布局（考试页）
- **桌面端**：面向桌面端用户设计
- **组件库限制**：仅后台管理页使用 Ant Design，考生端纯手写 CSS
- **代码编辑器**：CodeMirror 配置 C 语言模式，支持语法高亮和自动补全

## 部署

### Docker

构建阶段使用 Node.js 20 + pnpm 编译，生产阶段使用 Caddy 提供静态文件服务：

```bash
# 构建 Docker 镜像
docker build -t kx-exam-frontend .

# 运行容器
docker run -p 80:80 kx-exam-frontend
```

或使用构建脚本：

```bash
# Linux/macOS
bash scripts/docker-build.sh

# Windows
powershell -File scripts/docker-build.ps1
```

Caddy 配置了 SPA 路由回退、gzip 压缩、静态资源缓存和安全响应头。

## 文档

- [前端页面与功能](../docs/frontend/pages.md)
- [前端开发规则](../docs/frontend/rules.md)
- [项目架构](../docs/architecture.md)

## License

MIT
