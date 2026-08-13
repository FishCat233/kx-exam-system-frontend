# Changelog

## [0.1.4](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.1.3...kx-exam-system-frontend-v0.1.4) (2026-08-13)


### ✨ Features

* **admin:** 添加管理员后台页 ([515caac](https://github.com/FishCat233/kx-exam-system-frontend/commit/515caac1c2441b3c983c125c58ce630a805487db))
* **api:** 实现API模块及集成到管理后台 ([d3beea5](https://github.com/FishCat233/kx-exam-system-frontend/commit/d3beea509d817613947a0fd0b119898d94029971))
* **ChoiceQuestion:** 为单选题和多选题编辑器添加 Ctrl+S 快捷键保存功能 ([0edf0a3](https://github.com/FishCat233/kx-exam-system-frontend/commit/0edf0a34411161179ee99d365acee0d148c1b122))
* **CodeEditor:** 将编辑器主题从暗色改为亮色 ([74d16e9](https://github.com/FishCat233/kx-exam-system-frontend/commit/74d16e9da686b5713608343be2b1bc6c9c14d7e9))
* **dashboard:** 最近异常卡片标注 30 分钟窗口，表格限高滚动 ([b641195](https://github.com/FishCat233/kx-exam-system-frontend/commit/b641195a04211e9d1262fb59ec06e3598763a153))
* **deploy:** Caddyfile 反代 /api 与 /ws 实现同源部署 ([7e1444c](https://github.com/FishCat233/kx-exam-system-frontend/commit/7e1444c7567d737c9515a3db3666df165f90e288))
* **examStore:** 新增syncProblems方法同步题目状态 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **MainPage:** 实现题目刷新逻辑及状态管理 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **StatusBar:** 添加刷新题目按钮及状态显示 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* 使用组织 logo 替换站点 favicon ([6c16700](https://github.com/FishCat233/kx-exam-system-frontend/commit/6c16700960c1be260323907c78ee5540e2553323))
* 切屏与退出全屏警告改为全屏红色警示样式 ([09690d7](https://github.com/FishCat233/kx-exam-system-frontend/commit/09690d7861da7ae3eedd7fd4ce22f27bb34205de))
* 切屏警告展示时长延长至 10 秒 ([5ce5757](https://github.com/FishCat233/kx-exam-system-frontend/commit/5ce5757fe69ecdf37c2f0f9fa1cca441b36b7dbc))
* 初始化React + TypeScript + Vite项目基础结构 ([5433133](https://github.com/FishCat233/kx-exam-system-frontend/commit/5433133246db4276a84690e116c78c59e94a90e0))
* 增加 WS 连接门控，连不上时锁定答题 ([490694d](https://github.com/FishCat233/kx-exam-system-frontend/commit/490694d64fbb8cd728219b67252cf3436be166e4))
* 实现考试系统核心功能与界面 ([158a04b](https://github.com/FishCat233/kx-exam-system-frontend/commit/158a04b1a7dc0392333b65eb48d929653e7860f8))
* 新增学生考试功能模块 ([97d3329](https://github.com/FishCat233/kx-exam-system-frontend/commit/97d3329aacb5f3013a78937a21be92554cc568ba))
* 每分钟自动备份答案，未保存状态改用警示色标记 ([cb0c402](https://github.com/FishCat233/kx-exam-system-frontend/commit/cb0c4020cce648686cf62ed4563e24be6aac768b))
* **消息处理:** 添加新题目消息类型和处理逻辑 ([c8d1859](https://github.com/FishCat233/kx-exam-system-frontend/commit/c8d185914cbb03c0221a5f7fb1c6902b9ff75d0a))
* 添加remark-gfm支持表格和GFM语法 ([f2ab0bb](https://github.com/FishCat233/kx-exam-system-frontend/commit/f2ab0bbc348107b2fd7008b0f31b9f9f4f93a9d6))
* 添加题目刷新功能并优化考试表单 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **登录表单:** 允许姓名输入中文或英文 ([56c4654](https://github.com/FishCat233/kx-exam-system-frontend/commit/56c4654b14ed7deced44df7e03fbf4ab77bc632c))
* 移除考生考前承诺书流程 ([08be6a2](https://github.com/FishCat233/kx-exam-system-frontend/commit/08be6a226b0dc464cc69a4a00d468503575b7457))
* **编辑器:** 添加多种主题支持并优化暗色模式样式 ([4744f83](https://github.com/FishCat233/kx-exam-system-frontend/commit/4744f8357734639f8e60e5fda79a01d92520dbde))
* 考生题目接口改为走认证端点，防止答案泄露 ([a5c9429](https://github.com/FishCat233/kx-exam-system-frontend/commit/a5c9429b3e6cd2764fe4798cdbd62325715458d9))
* 题目 Markdown 渲染支持 LaTeX 公式 ([5cd6afe](https://github.com/FishCat233/kx-exam-system-frontend/commit/5cd6afe27594957f87f9051f247ce3ec7b740709))
* **题目:** 添加选择题支持功能 ([6da1405](https://github.com/FishCat233/kx-exam-system-frontend/commit/6da14053143dafe74caeef135c02c081a008b0b5))


### 🐛 Fixes

* **a11y:** 键盘聚焦保留可见 outline，补齐关键按钮焦点指示 ([9989f14](https://github.com/FishCat233/kx-exam-system-frontend/commit/9989f142f19a015592de279167a6726c95fd2a91))
* **admin:** 修复批量导入考生失败时无提示，支持 Tab 分隔 ([f4a05d7](https://github.com/FishCat233/kx-exam-system-frontend/commit/f4a05d7da6fcce67270243a0857e9bfdcf2d2ab7))
* **admin:** 后台管理修复与 mock 收敛 ([59ce4e0](https://github.com/FishCat233/kx-exam-system-frontend/commit/59ce4e042ac5dd57b51dd1d52da970ea2a5d92cd))
* **api:** 修正导入学生数据时请求体格式错误 ([7b760a0](https://github.com/FishCat233/kx-exam-system-frontend/commit/7b760a09762dbbc01e97c539d86714fba11c3368))
* **api:** 同步后端接口变更 ([829c5a5](https://github.com/FishCat233/kx-exam-system-frontend/commit/829c5a5a0e76534caba3591d0a1487672c31ff93))
* **api:** 登录凭证错误不再误报为登录过期，401 透出后端真实原因 ([41fdbb3](https://github.com/FishCat233/kx-exam-system-frontend/commit/41fdbb32038e5ad61e0ab1c18c66b6d6e9f922d9))
* **choice:** 选择题切题自动保存并修正保存失败状态 ([75d908c](https://github.com/FishCat233/kx-exam-system-frontend/commit/75d908c52812a7638eada4df0afec01bd2fffda1))
* **deploy:** 修复 Caddyfile log 指令位置错误，完善缓存响应头 ([72fae38](https://github.com/FishCat233/kx-exam-system-frontend/commit/72fae381c4b78ffe3a37f39dbf2c016bca18660e))
* **editor:** 统一 CodeMirror 依赖版本，修复编辑器崩溃 ([53c53c2](https://github.com/FishCat233/kx-exam-system-frontend/commit/53c53c2b35a7a136bceb9a4d07a4b04ef33c5e50))
* **ExamFormModal:** 移除手动输入时长，改为自动计算 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* logo.png 移除 Git LFS 跟踪，修复 CI 镜像中 logo 为指针文件导致加载失败 ([bb5dcd1](https://github.com/FishCat233/kx-exam-system-frontend/commit/bb5dcd1544512274e913db7c43f05bd14a5a70ed))
* **main:** 修复考生侧运行时问题 ([748773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/748773e602bb856d62b5c9504a026aa2206e1a73))
* **ws:** 关闭 WebSocket 前清除事件回调，防止 StrictMode 重挂载时误触发断开状态 ([8478d41](https://github.com/FishCat233/kx-exam-system-frontend/commit/8478d412aba3235ffc40694aa67b92844995c2c1))
* 修复 codeState 可选链缺失导致的严格类型检查失败 ([37c8d9b](https://github.com/FishCat233/kx-exam-system-frontend/commit/37c8d9b8e1866e2b4706146d4a4c6e217ed26279))
* **切屏检测:** 添加防抖处理并支持多屏幕环境检测 ([59cef18](https://github.com/FishCat233/kx-exam-system-frontend/commit/59cef18022273aa8d6396e9f25f02a5d9444558e))
* 回退 manifest 版本至 0.0.2，与现存 tag 对齐 ([eef2c02](https://github.com/FishCat233/kx-exam-system-frontend/commit/eef2c02f93ded78d2a05fb0209f34c9b9c2015b9))
* **学生表单:** 允许姓名输入中英文及空格 ([401bbf7](https://github.com/FishCat233/kx-exam-system-frontend/commit/401bbf7cb9a4f1fdc96c9138562f401247bd876f))
* 拦截 F11 并重定向为 API 全屏，修复全屏状态检测不到 ([10a7cb5](https://github.com/FishCat233/kx-exam-system-frontend/commit/10a7cb5d0349d28fccb1d56ac1780711322df2ae))
* 提交考试时增加无题目的提示 ([d04773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/d04773e96454644ea6d098abfc80e0900c944733))
* 考前承诺书弹窗确认按钮无法勾选同意，导致无法登录 ([97517d6](https://github.com/FishCat233/kx-exam-system-frontend/commit/97517d6babab8cba52fb0ac8ad8874338b3574c2))
* **考试:** 修复前端进入考试后，考试中新添加的题目没有得到排序的问题 ([16cc735](https://github.com/FishCat233/kx-exam-system-frontend/commit/16cc735aef4c7cc24a3c4020997b8bdcd0e57946))


### ⚡ Performance

* **组件:** 优化渲染性能并减少不必要的重渲染 ([c144bd9](https://github.com/FishCat233/kx-exam-system-frontend/commit/c144bd90ef8fa8c3d6af77dd5aef9f65990c5992))
* 路由懒加载与代码分割，首屏体积从 967KB 降至 85KB ([31b79fe](https://github.com/FishCat233/kx-exam-system-frontend/commit/31b79fe67ebecae5ba990826b44d18b76b9f4561))


### ♻️ Refactors

* **admin:** 使用mock数据替换API调用 ([0abe357](https://github.com/FishCat233/kx-exam-system-frontend/commit/0abe357300f0b04e56f793ac86407d5e021e6774))
* **mainpage:** 按功能域拆分 MainPage 为 8 个子组件 ([4b8e577](https://github.com/FishCat233/kx-exam-system-frontend/commit/4b8e57768fdcf7f5c75afb7bb344623b7b115938))
* **ui:** 统一考生侧样式并清理死代码 ([d7678cb](https://github.com/FishCat233/kx-exam-system-frontend/commit/d7678cb7fdc4c0120fd67789d7d00e9547fbf977))
* **ui:** 重构UI组件和样式 ([343b9c6](https://github.com/FishCat233/kx-exam-system-frontend/commit/343b9c6ddd96088d39fdda8ad81fe0cedab8c819))
* 优化考试状态同步逻辑 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* 清理考生侧 pledge 相关类型声明，与后端契约对齐 ([8c962b2](https://github.com/FishCat233/kx-exam-system-frontend/commit/8c962b2befa015a245543d11d2970a1061f23832))
* **考试:** 移除考试时长限制检查逻辑 ([915d098](https://github.com/FishCat233/kx-exam-system-frontend/commit/915d098206c3a0e99729d89f1b13adaa8b62954d))


### 📝 Documentation

* README License 段补充 AGPLv3 使用条款提示 ([ac8e470](https://github.com/FishCat233/kx-exam-system-frontend/commit/ac8e4709a8d775d517c284c92928f895853f40d2))
* README 部署章节补齐实际操作指令 ([ff2118e](https://github.com/FishCat233/kx-exam-system-frontend/commit/ff2118e163c3f8dad78075e74ed63bef5dc1b4ea))
* 更新 README 登录流程描述（移除考前承诺书） ([60c2848](https://github.com/FishCat233/kx-exam-system-frontend/commit/60c284883ab1a4c7fa1a12a941a2c03b54ea4f8f))
* 重写 README，改为速读入口并去重 ([f52459c](https://github.com/FishCat233/kx-exam-system-frontend/commit/f52459cc6dddb86a91bf14c4aa1ea49ecc36423b))


### 🤖 CI

* release-please PR 格式与后端对齐（标题 Release \，恢复 emoji 分区） ([bb88c96](https://github.com/FishCat233/kx-exam-system-frontend/commit/bb88c96eca6f80363b79ea0f0b11a1e3403e925c))
* release-please 合并后直接构建并推送镜像 ([f3d35f8](https://github.com/FishCat233/kx-exam-system-frontend/commit/f3d35f85531297ad7b52faae8be5f76c742048a8))
* release-please 显式空 tag-prefix，统一 v* 版本号 ([85eaeee](https://github.com/FishCat233/kx-exam-system-frontend/commit/85eaeee3607b91e01545ef3166569fd1bce38037))
* 更改 release-please 标题配置 ([28acaea](https://github.com/FishCat233/kx-exam-system-frontend/commit/28acaead39ecb25e0c65e84c7489710e12e30407))
* 更新 release-please 工作流和配置文件 ([149e9b5](https://github.com/FishCat233/kx-exam-system-frontend/commit/149e9b55ef6a1e2e6a4d52f521b7ca8348b30551))
* 更新 release-please 配置为使用配置文件 ([9546623](https://github.com/FishCat233/kx-exam-system-frontend/commit/9546623b412ece464e835d5748e3e0c2e4f4873e))
* 添加 Docker 构建配置和脚本 ([9bd2cc6](https://github.com/FishCat233/kx-exam-system-frontend/commit/9bd2cc66e883f616cd2dc1f2fdf942cc63b60c3c))
* 镜像构建工作流支持手动触发 ([883ae4d](https://github.com/FishCat233/kx-exam-system-frontend/commit/883ae4d656d94be5ed799460e053219210e83a61))
* 集成 ghcr 镜像发布工作流 ([62213d0](https://github.com/FishCat233/kx-exam-system-frontend/commit/62213d07912e27df39c73bd85208d2574ab39936))


### 🧰 Chores

* aa ([ba22b4f](https://github.com/FishCat233/kx-exam-system-frontend/commit/ba22b4f91a6745d9418c0d19add10ccb2c986a61))
* **deps-dev:** bump vite from 8.0.8 to 8.0.16 ([5dd4b66](https://github.com/FishCat233/kx-exam-system-frontend/commit/5dd4b66c038677d57094eb05eba610de4537635b))
* **deps-dev:** bump vite from 8.0.8 to 8.0.16 ([41f798d](https://github.com/FishCat233/kx-exam-system-frontend/commit/41f798dd77357e5e556ffc25a246250b6250cdf9))
* **deps:** bump postcss from 8.5.9 to 8.5.10 ([dbafc06](https://github.com/FishCat233/kx-exam-system-frontend/commit/dbafc061d9c57b202e2fb79b34fddfee4118c873))
* **deps:** bump postcss from 8.5.9 to 8.5.10 ([f1fd5d8](https://github.com/FishCat233/kx-exam-system-frontend/commit/f1fd5d80ee5d1e5323e4ecba1d84dcd3e6c89199))
* **deps:** bump react-router from 7.14.0 to 7.15.1 ([91a0597](https://github.com/FishCat233/kx-exam-system-frontend/commit/91a0597f6293f5d02667324be2357841bb10ecaa))
* **deps:** bump react-router from 7.14.0 to 7.15.1 ([c57f100](https://github.com/FishCat233/kx-exam-system-frontend/commit/c57f10059d69c6cf191176acb2b88442fcb04f50))
* **deps:** bump react-router from 7.15.1 to 7.18.2 ([9d9ed20](https://github.com/FishCat233/kx-exam-system-frontend/commit/9d9ed2064c1225996a93eb7ee6c6e229de506d7f))
* **deps:** bump react-router from 7.15.1 to 7.18.2 ([d085d95](https://github.com/FishCat233/kx-exam-system-frontend/commit/d085d959f7be2b9ad50f7556d1dd273e91aff2b7))
* **main:** release kx-exam-system-frontend 0.0.0 ([5a6f590](https://github.com/FishCat233/kx-exam-system-frontend/commit/5a6f59014108655bdf9c2455b86926da74eedc66))
* **main:** release kx-exam-system-frontend 0.0.0 ([68ea6e7](https://github.com/FishCat233/kx-exam-system-frontend/commit/68ea6e7b0b14a961ad4f65d0fba3ef59626f3be0))
* **main:** release kx-exam-system-frontend 0.0.2 ([1ec7656](https://github.com/FishCat233/kx-exam-system-frontend/commit/1ec765688577bd846a271279ec1d8def8d95743f))
* **main:** release kx-exam-system-frontend 0.0.2 ([0e28064](https://github.com/FishCat233/kx-exam-system-frontend/commit/0e28064d15594797a8eaeffc658065f0181ade09))
* **main:** release kx-exam-system-frontend 0.0.3 ([cafdb9d](https://github.com/FishCat233/kx-exam-system-frontend/commit/cafdb9d91c59ace585b1898ba1ffb30afdef0a5a))
* **main:** release kx-exam-system-frontend 0.0.3 ([515d5ae](https://github.com/FishCat233/kx-exam-system-frontend/commit/515d5ae45606aa873cd063903652731a50581952))
* **main:** release kx-exam-system-frontend 0.1.1 ([904c819](https://github.com/FishCat233/kx-exam-system-frontend/commit/904c8193f3af89699a3e26964f414965fc93e7c7))
* **main:** release kx-exam-system-frontend 0.1.1 ([f7f6523](https://github.com/FishCat233/kx-exam-system-frontend/commit/f7f652346e9bf5d68f2c7c245951ed25ac4f0ac2))
* **main:** release kx-exam-system-frontend 0.1.2 ([f39fce7](https://github.com/FishCat233/kx-exam-system-frontend/commit/f39fce72c7ed8537dfedbc5846c53685eed6b976))
* **main:** release kx-exam-system-frontend 0.1.2 ([c4d306c](https://github.com/FishCat233/kx-exam-system-frontend/commit/c4d306c7aa9414fbc63e24a6f650ce94063cc68f))
* **main:** release kx-exam-system-frontend 0.1.3 ([810390c](https://github.com/FishCat233/kx-exam-system-frontend/commit/810390cb32406e4f3d551ed4a8650587062f08a0))
* **main:** release kx-exam-system-frontend 0.1.3 ([3a9127d](https://github.com/FishCat233/kx-exam-system-frontend/commit/3a9127df1c9b1c7d59e45d97897ff233946e1fa1))
* prettier 忽略 CHANGELOG.md ([5b0b314](https://github.com/FishCat233/kx-exam-system-frontend/commit/5b0b31474ffa5ab6e88ef85bfa270ddd56a97c11))
* **release:** 版本号升级到 0.1.0 ([bc918d5](https://github.com/FishCat233/kx-exam-system-frontend/commit/bc918d5e1655e19e0fd089730e60bc68b31373b4))
* 更新 gitattributes ([e677b95](https://github.com/FishCat233/kx-exam-system-frontend/commit/e677b9558070dcb58e2c1538dae7e955f909f0fc))
* 许可证从 GPLv2 转为 AGPLv3 ([da18f8b](https://github.com/FishCat233/kx-exam-system-frontend/commit/da18f8b36ecb43f1868cab81a8807a526e325483))
* 许可证从 MIT 转为 GPLv2 ([283499a](https://github.com/FishCat233/kx-exam-system-frontend/commit/283499afd3910534b3d250bd597ffbd05ca85ffb))

## [0.1.3](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.1.2...kx-exam-system-frontend-v0.1.3) (2026-08-13)


### ✨ Features

* **dashboard:** 最近异常卡片标注 30 分钟窗口，表格限高滚动 ([b641195](https://github.com/FishCat233/kx-exam-system-frontend/commit/b641195a04211e9d1262fb59ec06e3598763a153))


### 🐛 Fixes

* **admin:** 修复批量导入考生失败时无提示，支持 Tab 分隔 ([f4a05d7](https://github.com/FishCat233/kx-exam-system-frontend/commit/f4a05d7da6fcce67270243a0857e9bfdcf2d2ab7))
* **deploy:** 修复 Caddyfile log 指令位置错误，完善缓存响应头 ([72fae38](https://github.com/FishCat233/kx-exam-system-frontend/commit/72fae381c4b78ffe3a37f39dbf2c016bca18660e))


### ⚡ Performance

* 路由懒加载与代码分割，首屏体积从 967KB 降至 85KB ([31b79fe](https://github.com/FishCat233/kx-exam-system-frontend/commit/31b79fe67ebecae5ba990826b44d18b76b9f4561))

## [0.1.2](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.1.1...kx-exam-system-frontend-v0.1.2) (2026-08-13)


### 🐛 Fixes

* **editor:** 统一 CodeMirror 依赖版本，修复编辑器崩溃 ([53c53c2](https://github.com/FishCat233/kx-exam-system-frontend/commit/53c53c2b35a7a136bceb9a4d07a4b04ef33c5e50))

## [0.1.1](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.1.0...kx-exam-system-frontend-v0.1.1) (2026-08-13)


### ✨ Features

* **admin:** 添加管理员后台页 ([515caac](https://github.com/FishCat233/kx-exam-system-frontend/commit/515caac1c2441b3c983c125c58ce630a805487db))
* **api:** 实现API模块及集成到管理后台 ([d3beea5](https://github.com/FishCat233/kx-exam-system-frontend/commit/d3beea509d817613947a0fd0b119898d94029971))
* **ChoiceQuestion:** 为单选题和多选题编辑器添加 Ctrl+S 快捷键保存功能 ([0edf0a3](https://github.com/FishCat233/kx-exam-system-frontend/commit/0edf0a34411161179ee99d365acee0d148c1b122))
* **CodeEditor:** 将编辑器主题从暗色改为亮色 ([74d16e9](https://github.com/FishCat233/kx-exam-system-frontend/commit/74d16e9da686b5713608343be2b1bc6c9c14d7e9))
* **deploy:** Caddyfile 反代 /api 与 /ws 实现同源部署 ([7e1444c](https://github.com/FishCat233/kx-exam-system-frontend/commit/7e1444c7567d737c9515a3db3666df165f90e288))
* **examStore:** 新增syncProblems方法同步题目状态 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **MainPage:** 实现题目刷新逻辑及状态管理 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **StatusBar:** 添加刷新题目按钮及状态显示 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* 使用组织 logo 替换站点 favicon ([6c16700](https://github.com/FishCat233/kx-exam-system-frontend/commit/6c16700960c1be260323907c78ee5540e2553323))
* 切屏与退出全屏警告改为全屏红色警示样式 ([09690d7](https://github.com/FishCat233/kx-exam-system-frontend/commit/09690d7861da7ae3eedd7fd4ce22f27bb34205de))
* 切屏警告展示时长延长至 10 秒 ([5ce5757](https://github.com/FishCat233/kx-exam-system-frontend/commit/5ce5757fe69ecdf37c2f0f9fa1cca441b36b7dbc))
* 初始化React + TypeScript + Vite项目基础结构 ([5433133](https://github.com/FishCat233/kx-exam-system-frontend/commit/5433133246db4276a84690e116c78c59e94a90e0))
* 增加 WS 连接门控，连不上时锁定答题 ([490694d](https://github.com/FishCat233/kx-exam-system-frontend/commit/490694d64fbb8cd728219b67252cf3436be166e4))
* 实现考试系统核心功能与界面 ([158a04b](https://github.com/FishCat233/kx-exam-system-frontend/commit/158a04b1a7dc0392333b65eb48d929653e7860f8))
* 新增学生考试功能模块 ([97d3329](https://github.com/FishCat233/kx-exam-system-frontend/commit/97d3329aacb5f3013a78937a21be92554cc568ba))
* 每分钟自动备份答案，未保存状态改用警示色标记 ([cb0c402](https://github.com/FishCat233/kx-exam-system-frontend/commit/cb0c4020cce648686cf62ed4563e24be6aac768b))
* **消息处理:** 添加新题目消息类型和处理逻辑 ([c8d1859](https://github.com/FishCat233/kx-exam-system-frontend/commit/c8d185914cbb03c0221a5f7fb1c6902b9ff75d0a))
* 添加remark-gfm支持表格和GFM语法 ([f2ab0bb](https://github.com/FishCat233/kx-exam-system-frontend/commit/f2ab0bbc348107b2fd7008b0f31b9f9f4f93a9d6))
* 添加题目刷新功能并优化考试表单 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* **登录表单:** 允许姓名输入中文或英文 ([56c4654](https://github.com/FishCat233/kx-exam-system-frontend/commit/56c4654b14ed7deced44df7e03fbf4ab77bc632c))
* 移除考生考前承诺书流程 ([08be6a2](https://github.com/FishCat233/kx-exam-system-frontend/commit/08be6a226b0dc464cc69a4a00d468503575b7457))
* **编辑器:** 添加多种主题支持并优化暗色模式样式 ([4744f83](https://github.com/FishCat233/kx-exam-system-frontend/commit/4744f8357734639f8e60e5fda79a01d92520dbde))
* 考生题目接口改为走认证端点，防止答案泄露 ([a5c9429](https://github.com/FishCat233/kx-exam-system-frontend/commit/a5c9429b3e6cd2764fe4798cdbd62325715458d9))
* 题目 Markdown 渲染支持 LaTeX 公式 ([5cd6afe](https://github.com/FishCat233/kx-exam-system-frontend/commit/5cd6afe27594957f87f9051f247ce3ec7b740709))
* **题目:** 添加选择题支持功能 ([6da1405](https://github.com/FishCat233/kx-exam-system-frontend/commit/6da14053143dafe74caeef135c02c081a008b0b5))


### 🐛 Fixes

* **a11y:** 键盘聚焦保留可见 outline，补齐关键按钮焦点指示 ([9989f14](https://github.com/FishCat233/kx-exam-system-frontend/commit/9989f142f19a015592de279167a6726c95fd2a91))
* **admin:** 后台管理修复与 mock 收敛 ([59ce4e0](https://github.com/FishCat233/kx-exam-system-frontend/commit/59ce4e042ac5dd57b51dd1d52da970ea2a5d92cd))
* **api:** 修正导入学生数据时请求体格式错误 ([7b760a0](https://github.com/FishCat233/kx-exam-system-frontend/commit/7b760a09762dbbc01e97c539d86714fba11c3368))
* **api:** 同步后端接口变更 ([829c5a5](https://github.com/FishCat233/kx-exam-system-frontend/commit/829c5a5a0e76534caba3591d0a1487672c31ff93))
* **api:** 登录凭证错误不再误报为登录过期，401 透出后端真实原因 ([41fdbb3](https://github.com/FishCat233/kx-exam-system-frontend/commit/41fdbb32038e5ad61e0ab1c18c66b6d6e9f922d9))
* **choice:** 选择题切题自动保存并修正保存失败状态 ([75d908c](https://github.com/FishCat233/kx-exam-system-frontend/commit/75d908c52812a7638eada4df0afec01bd2fffda1))
* **ExamFormModal:** 移除手动输入时长，改为自动计算 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* logo.png 移除 Git LFS 跟踪，修复 CI 镜像中 logo 为指针文件导致加载失败 ([bb5dcd1](https://github.com/FishCat233/kx-exam-system-frontend/commit/bb5dcd1544512274e913db7c43f05bd14a5a70ed))
* **main:** 修复考生侧运行时问题 ([748773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/748773e602bb856d62b5c9504a026aa2206e1a73))
* **ws:** 关闭 WebSocket 前清除事件回调，防止 StrictMode 重挂载时误触发断开状态 ([8478d41](https://github.com/FishCat233/kx-exam-system-frontend/commit/8478d412aba3235ffc40694aa67b92844995c2c1))
* 修复 codeState 可选链缺失导致的严格类型检查失败 ([37c8d9b](https://github.com/FishCat233/kx-exam-system-frontend/commit/37c8d9b8e1866e2b4706146d4a4c6e217ed26279))
* **切屏检测:** 添加防抖处理并支持多屏幕环境检测 ([59cef18](https://github.com/FishCat233/kx-exam-system-frontend/commit/59cef18022273aa8d6396e9f25f02a5d9444558e))
* 回退 manifest 版本至 0.0.2，与现存 tag 对齐 ([eef2c02](https://github.com/FishCat233/kx-exam-system-frontend/commit/eef2c02f93ded78d2a05fb0209f34c9b9c2015b9))
* **学生表单:** 允许姓名输入中英文及空格 ([401bbf7](https://github.com/FishCat233/kx-exam-system-frontend/commit/401bbf7cb9a4f1fdc96c9138562f401247bd876f))
* 拦截 F11 并重定向为 API 全屏，修复全屏状态检测不到 ([10a7cb5](https://github.com/FishCat233/kx-exam-system-frontend/commit/10a7cb5d0349d28fccb1d56ac1780711322df2ae))
* 提交考试时增加无题目的提示 ([d04773e](https://github.com/FishCat233/kx-exam-system-frontend/commit/d04773e96454644ea6d098abfc80e0900c944733))
* 考前承诺书弹窗确认按钮无法勾选同意，导致无法登录 ([97517d6](https://github.com/FishCat233/kx-exam-system-frontend/commit/97517d6babab8cba52fb0ac8ad8874338b3574c2))
* **考试:** 修复前端进入考试后，考试中新添加的题目没有得到排序的问题 ([16cc735](https://github.com/FishCat233/kx-exam-system-frontend/commit/16cc735aef4c7cc24a3c4020997b8bdcd0e57946))


### ⚡ Performance

* **组件:** 优化渲染性能并减少不必要的重渲染 ([c144bd9](https://github.com/FishCat233/kx-exam-system-frontend/commit/c144bd90ef8fa8c3d6af77dd5aef9f65990c5992))


### ♻️ Refactors

* **admin:** 使用mock数据替换API调用 ([0abe357](https://github.com/FishCat233/kx-exam-system-frontend/commit/0abe357300f0b04e56f793ac86407d5e021e6774))
* **mainpage:** 按功能域拆分 MainPage 为 8 个子组件 ([4b8e577](https://github.com/FishCat233/kx-exam-system-frontend/commit/4b8e57768fdcf7f5c75afb7bb344623b7b115938))
* **ui:** 统一考生侧样式并清理死代码 ([d7678cb](https://github.com/FishCat233/kx-exam-system-frontend/commit/d7678cb7fdc4c0120fd67789d7d00e9547fbf977))
* **ui:** 重构UI组件和样式 ([343b9c6](https://github.com/FishCat233/kx-exam-system-frontend/commit/343b9c6ddd96088d39fdda8ad81fe0cedab8c819))
* 优化考试状态同步逻辑 ([b415f1b](https://github.com/FishCat233/kx-exam-system-frontend/commit/b415f1bae3ece5d9084254c9f274fa191cb0fd38))
* 清理考生侧 pledge 相关类型声明，与后端契约对齐 ([8c962b2](https://github.com/FishCat233/kx-exam-system-frontend/commit/8c962b2befa015a245543d11d2970a1061f23832))
* **考试:** 移除考试时长限制检查逻辑 ([915d098](https://github.com/FishCat233/kx-exam-system-frontend/commit/915d098206c3a0e99729d89f1b13adaa8b62954d))


### 📝 Documentation

* README License 段补充 AGPLv3 使用条款提示 ([ac8e470](https://github.com/FishCat233/kx-exam-system-frontend/commit/ac8e4709a8d775d517c284c92928f895853f40d2))
* README 部署章节补齐实际操作指令 ([ff2118e](https://github.com/FishCat233/kx-exam-system-frontend/commit/ff2118e163c3f8dad78075e74ed63bef5dc1b4ea))
* 更新 README 登录流程描述（移除考前承诺书） ([60c2848](https://github.com/FishCat233/kx-exam-system-frontend/commit/60c284883ab1a4c7fa1a12a941a2c03b54ea4f8f))
* 重写 README，改为速读入口并去重 ([f52459c](https://github.com/FishCat233/kx-exam-system-frontend/commit/f52459cc6dddb86a91bf14c4aa1ea49ecc36423b))


### 🤖 CI

* release-please 合并后直接构建并推送镜像 ([f3d35f8](https://github.com/FishCat233/kx-exam-system-frontend/commit/f3d35f85531297ad7b52faae8be5f76c742048a8))
* release-please 显式空 tag-prefix，统一 v* 版本号 ([85eaeee](https://github.com/FishCat233/kx-exam-system-frontend/commit/85eaeee3607b91e01545ef3166569fd1bce38037))
* 更改 release-please 标题配置 ([28acaea](https://github.com/FishCat233/kx-exam-system-frontend/commit/28acaead39ecb25e0c65e84c7489710e12e30407))
* 更新 release-please 工作流和配置文件 ([149e9b5](https://github.com/FishCat233/kx-exam-system-frontend/commit/149e9b55ef6a1e2e6a4d52f521b7ca8348b30551))
* 更新 release-please 配置为使用配置文件 ([9546623](https://github.com/FishCat233/kx-exam-system-frontend/commit/9546623b412ece464e835d5748e3e0c2e4f4873e))
* 添加 Docker 构建配置和脚本 ([9bd2cc6](https://github.com/FishCat233/kx-exam-system-frontend/commit/9bd2cc66e883f616cd2dc1f2fdf942cc63b60c3c))
* 镜像构建工作流支持手动触发 ([883ae4d](https://github.com/FishCat233/kx-exam-system-frontend/commit/883ae4d656d94be5ed799460e053219210e83a61))
* 集成 ghcr 镜像发布工作流 ([62213d0](https://github.com/FishCat233/kx-exam-system-frontend/commit/62213d07912e27df39c73bd85208d2574ab39936))


### 🧰 Chores

* aa ([ba22b4f](https://github.com/FishCat233/kx-exam-system-frontend/commit/ba22b4f91a6745d9418c0d19add10ccb2c986a61))
* **deps-dev:** bump vite from 8.0.8 to 8.0.16 ([5dd4b66](https://github.com/FishCat233/kx-exam-system-frontend/commit/5dd4b66c038677d57094eb05eba610de4537635b))
* **deps-dev:** bump vite from 8.0.8 to 8.0.16 ([41f798d](https://github.com/FishCat233/kx-exam-system-frontend/commit/41f798dd77357e5e556ffc25a246250b6250cdf9))
* **deps:** bump postcss from 8.5.9 to 8.5.10 ([dbafc06](https://github.com/FishCat233/kx-exam-system-frontend/commit/dbafc061d9c57b202e2fb79b34fddfee4118c873))
* **deps:** bump postcss from 8.5.9 to 8.5.10 ([f1fd5d8](https://github.com/FishCat233/kx-exam-system-frontend/commit/f1fd5d80ee5d1e5323e4ecba1d84dcd3e6c89199))
* **deps:** bump react-router from 7.14.0 to 7.15.1 ([91a0597](https://github.com/FishCat233/kx-exam-system-frontend/commit/91a0597f6293f5d02667324be2357841bb10ecaa))
* **deps:** bump react-router from 7.14.0 to 7.15.1 ([c57f100](https://github.com/FishCat233/kx-exam-system-frontend/commit/c57f10059d69c6cf191176acb2b88442fcb04f50))
* **deps:** bump react-router from 7.15.1 to 7.18.2 ([9d9ed20](https://github.com/FishCat233/kx-exam-system-frontend/commit/9d9ed2064c1225996a93eb7ee6c6e229de506d7f))
* **deps:** bump react-router from 7.15.1 to 7.18.2 ([d085d95](https://github.com/FishCat233/kx-exam-system-frontend/commit/d085d959f7be2b9ad50f7556d1dd273e91aff2b7))
* **main:** release kx-exam-system-frontend 0.0.0 ([5a6f590](https://github.com/FishCat233/kx-exam-system-frontend/commit/5a6f59014108655bdf9c2455b86926da74eedc66))
* **main:** release kx-exam-system-frontend 0.0.0 ([68ea6e7](https://github.com/FishCat233/kx-exam-system-frontend/commit/68ea6e7b0b14a961ad4f65d0fba3ef59626f3be0))
* **main:** release kx-exam-system-frontend 0.0.2 ([1ec7656](https://github.com/FishCat233/kx-exam-system-frontend/commit/1ec765688577bd846a271279ec1d8def8d95743f))
* **main:** release kx-exam-system-frontend 0.0.2 ([0e28064](https://github.com/FishCat233/kx-exam-system-frontend/commit/0e28064d15594797a8eaeffc658065f0181ade09))
* **main:** release kx-exam-system-frontend 0.0.3 ([cafdb9d](https://github.com/FishCat233/kx-exam-system-frontend/commit/cafdb9d91c59ace585b1898ba1ffb30afdef0a5a))
* **main:** release kx-exam-system-frontend 0.0.3 ([515d5ae](https://github.com/FishCat233/kx-exam-system-frontend/commit/515d5ae45606aa873cd063903652731a50581952))
* prettier 忽略 CHANGELOG.md ([5b0b314](https://github.com/FishCat233/kx-exam-system-frontend/commit/5b0b31474ffa5ab6e88ef85bfa270ddd56a97c11))
* **release:** 版本号升级到 0.1.0 ([bc918d5](https://github.com/FishCat233/kx-exam-system-frontend/commit/bc918d5e1655e19e0fd089730e60bc68b31373b4))
* 更新 gitattributes ([e677b95](https://github.com/FishCat233/kx-exam-system-frontend/commit/e677b9558070dcb58e2c1538dae7e955f909f0fc))
* 许可证从 GPLv2 转为 AGPLv3 ([da18f8b](https://github.com/FishCat233/kx-exam-system-frontend/commit/da18f8b36ecb43f1868cab81a8807a526e325483))
* 许可证从 MIT 转为 GPLv2 ([283499a](https://github.com/FishCat233/kx-exam-system-frontend/commit/283499afd3910534b3d250bd597ffbd05ca85ffb))

## [0.0.3](https://github.com/FishCat233/kx-exam-system-frontend/compare/kx-exam-system-frontend-v0.0.2...kx-exam-system-frontend-v0.0.3) (2026-08-12)


### 📝 Documentation

* README License 段补充 AGPLv3 使用条款提示 ([ac8e470](https://github.com/FishCat233/kx-exam-system-frontend/commit/ac8e4709a8d775d517c284c92928f895853f40d2))
* 重写 README，改为速读入口并去重 ([f52459c](https://github.com/FishCat233/kx-exam-system-frontend/commit/f52459cc6dddb86a91bf14c4aa1ea49ecc36423b))


### 🤖 CI

* release-please 显式空 tag-prefix，统一 v* 版本号 ([85eaeee](https://github.com/FishCat233/kx-exam-system-frontend/commit/85eaeee3607b91e01545ef3166569fd1bce38037))


### 🧰 Chores

* 许可证从 GPLv2 转为 AGPLv3 ([da18f8b](https://github.com/FishCat233/kx-exam-system-frontend/commit/da18f8b36ecb43f1868cab81a8807a526e325483))
* 许可证从 MIT 转为 GPLv2 ([283499a](https://github.com/FishCat233/kx-exam-system-frontend/commit/283499afd3910534b3d250bd597ffbd05ca85ffb))

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
