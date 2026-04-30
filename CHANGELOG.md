# Changelog

## [0.0.2](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.0.1...kx-exam-system-frontend-v0.0.2) (2026-04-30)


### ✨ Features

* **ChoiceQuestion:** 为单选题和多选题编辑器添加 Ctrl+S 快捷键保存功能 ([0edf0a3](https://github.com/FishCat233/kx-exam-system-frontend/commit/0edf0a34411161179ee99d365acee0d148c1b122))
* **CodeEditor:** 将编辑器主题从暗色改为亮色 ([74d16e9](https://github.com/FishCat233/kx-exam-system-frontend/commit/74d16e9da686b5713608343be2b1bc6c9c14d7e9))
* **消息处理:** 添加新题目消息类型和处理逻辑 ([c8d1859](https://github.com/FishCat233/kx-exam-system-frontend/commit/c8d185914cbb03c0221a5f7fb1c6902b9ff75d0a))
* 添加remark-gfm支持表格和GFM语法 ([f2ab0bb](https://github.com/FishCat233/kx-exam-system-frontend/commit/f2ab0bbc348107b2fd7008b0f31b9f9f4f93a9d6))
* **登录表单:** 允许姓名输入中文或英文 ([56c4654](https://github.com/FishCat233/kx-exam-system-frontend/commit/56c4654b14ed7deced44df7e03fbf4ab77bc632c))
* **编辑器:** 添加多种主题支持并优化暗色模式样式 ([4744f83](https://github.com/FishCat233/kx-exam-system-frontend/commit/4744f8357734639f8e60e5fda79a01d92520dbde))
* **题目:** 添加选择题支持功能 ([6da1405](https://github.com/FishCat233/kx-exam-system-frontend/commit/6da14053143dafe74caeef135c02c081a008b0b5))


### 🐛 Fixes

* **api:** 修正导入学生数据时请求体格式错误 ([7b760a0](https://github.com/FishCat233/kx-exam-system-frontend/commit/7b760a09762dbbc01e97c539d86714fba11c3368))
* **切屏检测:** 添加防抖处理并支持多屏幕环境检测 ([59cef18](https://github.com/FishCat233/kx-exam-system-frontend/commit/59cef18022273aa8d6396e9f25f02a5d9444558e))
* **学生表单:** 允许姓名输入中英文及空格 ([401bbf7](https://github.com/FishCat233/kx-exam-system-frontend/commit/401bbf7cb9a4f1fdc96c9138562f401247bd876f))
* 提交考试时增加无题目的提示 ([d04773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/d04773e96454644ea6d098abfc80e0900c944733))
* **考试:** 修复前端进入考试后，考试中新添加的题目没有得到排序的问题 ([16cc735](https://github.com/FishCat233/kx-exam-system-frontend/commit/16cc735aef4c7cc24a3c4020997b8bdcd0e57946))


### ⚡ Performance

* **组件:** 优化渲染性能并减少不必要的重渲染 ([c144bd9](https://github.com/FishCat233/kx-exam-system-frontend/commit/c144bd90ef8fa8c3d6af77dd5aef9f65990c5992))


### ♻️ Refactors

* **ui:** 重构UI组件和样式 ([343b9c6](https://github.com/FishCat233/kx-exam-system-frontend/commit/343b9c6ddd96088d39fdda8ad81fe0cedab8c819))
* **考试:** 移除考试时长限制检查逻辑 ([915d098](https://github.com/FishCat233/kx-exam-system-frontend/commit/915d098206c3a0e99729d89f1b13adaa8b62954d))


### 🤖 CI

* 更改 release-please 标题配置 ([28acaea](https://github.com/FishCat233/kx-exam-system-frontend/commit/28acaead39ecb25e0c65e84c7489710e12e30407))
* 添加 Docker 构建配置和脚本 ([9bd2cc6](https://github.com/FishCat233/kx-exam-system-frontend/commit/9bd2cc66e883f616cd2dc1f2fdf942cc63b60c3c))

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
