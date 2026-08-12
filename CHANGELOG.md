# Changelog

## [0.0.2](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.0.1...kx-exam-system-frontend-v0.0.2) (2026-08-12)


### ✨ Features

* **ChoiceQuestion:** 为单选题和多选题编辑器添加 Ctrl+S 快捷键保存功能 ([0edf0a3](https://github.com/FishCat233/kx-exam-system-frontend/commit/0edf0a34411161179ee99d365acee0d148c1b122))
* **CodeEditor:** 将编辑器主题从暗色改为亮色 ([74d16e9](https://github.com/FishCat233/kx-exam-system-frontend/commit/74d16e9da686b5713608343be2b1bc6c9c14d7e9))
* **deploy:** Caddyfile 反代 /api 与 /ws 实现同源部署 ([7e1444c](https://github.com/FishCat233/kx-exam-system-frontend/commit/7e1444c7567d737c9515a3db3666df165f90e288))
* **消息处理:** 添加新题目消息类型和处理逻辑 ([c8d1859](https://github.com/FishCat233/kx-exam-system-frontend/commit/c8d185914cbb03c0221a5f7fb1c6902b9ff75d0a))
* 添加remark-gfm支持表格和GFM语法 ([f2ab0bb](https://github.com/FishCat233/kx-exam-system-frontend/commit/f2ab0bbc348107b2fd7008b0f31b9f9f4f93a9d6))
* **登录表单:** 允许姓名输入中文或英文 ([56c4654](https://github.com/FishCat233/kx-exam-system-frontend/commit/56c4654b14ed7deced44df7e03fbf4ab77bc632c))
* 移除考生考前承诺书流程 ([08be6a2](https://github.com/FishCat233/kx-exam-system-frontend/commit/08be6a226b0dc464cc69a4a00d468503575b7457))
* **编辑器:** 添加多种主题支持并优化暗色模式样式 ([4744f83](https://github.com/FishCat233/kx-exam-system-frontend/commit/4744f8357734639f8e60e5fda79a01d92520dbde))
* 考生题目接口改为走认证端点，防止答案泄露 ([a5c9429](https://github.com/FishCat233/kx-exam-system-frontend/commit/a5c9429b3e6cd2764fe4798cdbd62325715458d9))
* **题目:** 添加选择题支持功能 ([6da1405](https://github.com/FishCat233/kx-exam-system-frontend/commit/6da14053143dafe74caeef135c02c081a008b0b5))


### 🐛 Fixes

* **a11y:** 键盘聚焦保留可见 outline，补齐关键按钮焦点指示 ([9989f14](https://github.com/FishCat233/kx-exam-system-frontend/commit/9989f142f19a015592de279167a6726c95fd2a91))
* **admin:** 后台管理修复与 mock 收敛 ([59ce4e0](https://github.com/FishCat233/kx-exam-system-frontend/commit/59ce4e042ac5dd57b51dd1d52da970ea2a5d92cd))
* **api:** 修正导入学生数据时请求体格式错误 ([7b760a0](https://github.com/FishCat233/kx-exam-system-frontend/commit/7b760a09762dbbc01e97c539d86714fba11c3368))
* **api:** 同步后端接口变更 ([829c5a5](https://github.com/FishCat233/kx-exam-system-frontend/commit/829c5a5a0e76534caba3591d0a1487672c31ff93))
* **api:** 登录凭证错误不再误报为登录过期，401 透出后端真实原因 ([41fdbb3](https://github.com/FishCat233/kx-exam-system-frontend/commit/41fdbb32038e5ad61e0ab1c18c66b6d6e9f922d9))
* **choice:** 选择题切题自动保存并修正保存失败状态 ([75d908c](https://github.com/FishCat233/kx-exam-system-frontend/commit/75d908c52812a7638eada4df0afec01bd2fffda1))
* **main:** 修复考生侧运行时问题 ([748773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/748773e602bb856d62b5c9504a026aa2206e1a73))
* **ws:** 关闭 WebSocket 前清除事件回调，防止 StrictMode 重挂载时误触发断开状态 ([8478d41](https://github.com/FishCat233/kx-exam-system-frontend/commit/8478d412aba3235ffc40694aa67b92844995c2c1))
* **切屏检测:** 添加防抖处理并支持多屏幕环境检测 ([59cef18](https://github.com/FishCat233/kx-exam-system-frontend/commit/59cef18022273aa8d6396e9f25f02a5d9444558e))
* **学生表单:** 允许姓名输入中英文及空格 ([401bbf7](https://github.com/FishCat233/kx-exam-system-frontend/commit/401bbf7cb9a4f1fdc96c9138562f401247bd876f))
* 提交考试时增加无题目的提示 ([d04773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/d04773e96454644ea6d098abfc80e0900c944733))
* 考前承诺书弹窗确认按钮无法勾选同意，导致无法登录 ([97517d6](https://github.com/FishCat233/kx-exam-system-frontend/commit/97517d6babab8cba52fb0ac8ad8874338b3574c2))
* **考试:** 修复前端进入考试后，考试中新添加的题目没有得到排序的问题 ([16cc735](https://github.com/FishCat233/kx-exam-system-frontend/commit/16cc735aef4c7cc24a3c4020997b8bdcd0e57946))


### ⚡ Performance

* **组件:** 优化渲染性能并减少不必要的重渲染 ([c144bd9](https://github.com/FishCat233/kx-exam-system-frontend/commit/c144bd90ef8fa8c3d6af77dd5aef9f65990c5992))


### ♻️ Refactors

* **mainpage:** 按功能域拆分 MainPage 为 8 个子组件 ([4b8e577](https://github.com/FishCat233/kx-exam-system-frontend/commit/4b8e57768fdcf7f5c75afb7bb344623b7b115938))
* **ui:** 统一考生侧样式并清理死代码 ([d7678cb](https://github.com/FishCat233/kx-exam-system-frontend/commit/d7678cb7fdc4c0120fd67789d7d00e9547fbf977))
* **ui:** 重构UI组件和样式 ([343b9c6](https://github.com/FishCat233/kx-exam-system-frontend/commit/343b9c6ddd96088d39fdda8ad81fe0cedab8c819))
* 清理考生侧 pledge 相关类型声明，与后端契约对齐 ([8c962b2](https://github.com/FishCat233/kx-exam-system-frontend/commit/8c962b2befa015a245543d11d2970a1061f23832))
* **考试:** 移除考试时长限制检查逻辑 ([915d098](https://github.com/FishCat233/kx-exam-system-frontend/commit/915d098206c3a0e99729d89f1b13adaa8b62954d))


### 📝 Documentation

* 更新 README 登录流程描述（移除考前承诺书） ([60c2848](https://github.com/FishCat233/kx-exam-system-frontend/commit/60c284883ab1a4c7fa1a12a941a2c03b54ea4f8f))


### 🤖 CI

* release-please 合并后直接构建并推送镜像 ([f3d35f8](https://github.com/FishCat233/kx-exam-system-frontend/commit/f3d35f85531297ad7b52faae8be5f76c742048a8))
* 更改 release-please 标题配置 ([28acaea](https://github.com/FishCat233/kx-exam-system-frontend/commit/28acaead39ecb25e0c65e84c7489710e12e30407))
* 添加 Docker 构建配置和脚本 ([9bd2cc6](https://github.com/FishCat233/kx-exam-system-frontend/commit/9bd2cc66e883f616cd2dc1f2fdf942cc63b60c3c))
* 镜像构建工作流支持手动触发 ([883ae4d](https://github.com/FishCat233/kx-exam-system-frontend/commit/883ae4d656d94be5ed799460e053219210e83a61))
* 集成 ghcr 镜像发布工作流 ([62213d0](https://github.com/FishCat233/kx-exam-system-frontend/commit/62213d07912e27df39c73bd85208d2574ab39936))

## [0.0.1](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.0.0...kx-exam-system-frontend-v0.0.1) (2026-04-24)

### 🤖 CI

- 更新 release-please 工作流和配置文件 ([149e9b5](https://github.com/FishCat233/kx-exam-system-frontend/commit/149e9b55ef6a1e2e6a4d52f521b7ca8348b30551))

## 0.0.0 (2026-04-24)

### Features

- **admin:** 添加管理员后台页 ([515caac](https://github.com/FishCat233/kx-exam-system-frontend/commit/515caac1c2441b3c983c125c58ce630a805487db))
- **api:** 实现API模块及集成到管理后台 ([d3beea5](https://github.com/FishCat233/kx-exam-system-frontend/commit/d3beea509d817613947a0fd0b119898d94029971))
- **examStore:** 新增syncProblems方法同步题目状态 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
- **MainPage:** 实现题目刷新逻辑及状态管理 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
- **StatusBar:** 添加刷新题目按钮及状态显示 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
- 初始化React + TypeScript + Vite项目基础结构 ([5433133](https://github.com/FishCat233/kx-exam-system-frontend/commit/5433133246db4276a84690e116c78c59e94a90e0))
- 实现考试系统核心功能与界面 ([158a04b](https://github.com/FishCat233/kx-exam-system-frontend/commit/158a04b1a7dc0392333b65eb48d929653e7860f8))
- 新增学生考试功能模块 ([97d3329](https://github.com/FishCat233/kx-exam-system-frontend/commit/97d3329aacb5f3013a78937a21be92554cc568ba))
- 添加题目刷新功能并优化考试表单 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))

### Bug Fixes

- **ExamFormModal:** 移除手动输入时长，改为自动计算 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
