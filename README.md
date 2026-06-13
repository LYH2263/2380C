# Neurosama 粉丝二创小说阅读网站

一个现代化的 Neurosama 粉丝二创小说阅读平台，使用 Vue.js + Nuxt.js 构建，支持服务端渲染（SSR）。

![Neurosama Novels](https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800)

## 🛠 技术栈

- **Frontend**: Vue 3 + Nuxt 3 + Tailwind CSS
- **Backend**: Nuxt Server Routes (API)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Cookie
- **Deployment**: Docker + Docker Compose

## ✨ 功能特性

### 用户功能
- 📚 浏览和搜索小说
- 📖 沉浸式阅读体验
- ❤️ 点赞小说
- ⭐ 收藏小说
- 🌟 评分系统（1-5分）
- 💬 章节评论和段落评论
- 🔖 阅读进度记录

### 管理功能
- 📊 数据统计仪表盘
- 📝 小说 CRUD 管理
- 📄 章节编辑和排序
- 👥 用户管理

## 🚀 启动指南 (How to Run)

### 使用 Docker（推荐）

1. 确保 Docker Desktop 已启动

2. 在根目录执行：
```bash
docker compose up --build
```

3. 等待容器启动完成（首次启动需要几分钟）

4. 访问应用：http://localhost:3380

### 本地开发

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
```

3. 启动数据库（需要本地 PostgreSQL）：
```bash
# 确保 PostgreSQL 运行在 localhost:5432
```

4. 初始化数据库：
```bash
npx prisma migrate dev
npx prisma db seed
```

5. 启动开发服务器：
```bash
npm run dev
```

## 🔗 服务地址 (Services)

| 服务 | 地址 |
|------|------|
| 前端应用 | http://localhost:3380 |
| 数据库 | localhost:5432 |

## 🧪 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@neurosama.fan | admin123 |
| 普通用户 | neuro_fan@example.com | user123 |
| 普通用户 | vedal_lover@example.com | user123 |

## 📁 项目结构

```
├── assets/            # 静态资源和全局样式
├── components/        # Vue 组件
├── composables/       # Vue 组合式函数
├── layouts/           # 页面布局
├── middleware/        # 路由中间件
├── pages/             # 页面路由
├── prisma/            # 数据库 Schema 和 Seed
├── public/            # 公共静态文件
├── server/            # 服务端代码
│   ├── api/           # API 路由
│   └── utils/         # 服务端工具函数
├── docker-compose.yml # Docker 编排配置
├── Dockerfile         # Docker 构建配置
├── nuxt.config.ts     # Nuxt 配置
└── package.json       # 项目依赖
```

## 🎨 UI 设计

- 现代渐变色彩搭配（粉紫色调）
- 毛玻璃效果（Glassmorphism）
- 响应式设计，支持移动端
- 平滑动画过渡效果
- 骨架屏加载状态

## 📝 API 接口

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/logout` - 退出登录
- `GET /api/auth/me` - 获取当前用户

### 小说
- `GET /api/novels` - 获取小说列表
- `POST /api/novels` - 创建小说
- `GET /api/novels/:id` - 获取小说详情
- `PUT /api/novels/:id` - 更新小说
- `DELETE /api/novels/:id` - 删除小说

### 章节
- `GET /api/novels/:novelId/chapters` - 获取章节列表
- `POST /api/novels/:novelId/chapters` - 添加章节
- `GET /api/novels/:novelId/chapters/:chapterId` - 获取章节内容
- `PUT /api/novels/:novelId/chapters/:chapterId` - 更新章节
- `DELETE /api/novels/:novelId/chapters/:chapterId` - 删除章节

### 互动
- `POST /api/novels/:novelId/like` - 点赞/取消点赞
- `POST /api/novels/:novelId/favorite` - 收藏/取消收藏
- `POST /api/novels/:novelId/rating` - 评分
- `GET /api/chapters/:chapterId/comments` - 获取评论
- `POST /api/chapters/:chapterId/comments` - 发表评论

## 🐳 Docker 配置说明

### 服务组成
- **db**: PostgreSQL 15 数据库
- **app**: Nuxt.js SSR 应用

### 数据持久化
数据库数据通过 Docker Volume 持久化存储，重启容器不会丢失数据。

### 端口映射
- 应用：3380 -> 3000
- 数据库：5432 -> 5432

## ⚠️ 注意事项

1. 首次启动时会自动运行数据库迁移和种子数据填充
2. 如果遇到端口冲突，可以修改 `docker-compose.yml` 中的端口映射
3. 生产环境请修改 JWT_SECRET 为更安全的密钥

## 📄 License

MIT License

---

💜 献给所有 Neurosama 的粉丝们！
