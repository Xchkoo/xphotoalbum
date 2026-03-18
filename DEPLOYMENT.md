# xPhotoAlbum 部署文档

摄影作品展示网站，包含完整的前台展示和后台管理系统。

## 📦 项目信息

- **GitHub 仓库**: https://github.com/xchkoo-xclaw/xphotoalbum
- **技术栈**: Next.js 14 + shadcn/ui + Prisma + NextAuth.js
- **数据库**: Vercel Postgres
- **图片存储**: Vercel Blob
- **部署平台**: Vercel

## 🚀 快速部署指南

### 步骤 1: Fork 或 Clone 项目

```bash
git clone https://github.com/xchkoo-xclaw/xphotoalbum.git
cd xphotoalbum
```

### 步骤 2: 在 Vercel 创建项目

1. 登录 [Vercel](https://vercel.com)
2. 点击 "Add New" → "Project"
3. 选择 "Import Git Repository"
4. 选择你的 `xphotoalbum` 仓库
5. 点击 "Import"

### 步骤 3: 创建 Vercel Postgres 数据库

1. 在 Vercel 项目页面，进入 "Storage" 标签
2. 点击 "Create Database"
3. 选择 "Postgres"
4. 输入数据库名称（如 `xphotoalbum-db`）
5. 选择区域（推荐选择离你最近的区域）
6. 点击 "Create"
7. 创建完成后，点击 "Connect to Project"
8. 选择你的 xphotoalbum 项目
9. 环境变量会自动添加到项目中

### 步骤 4: 创建 Vercel Blob 存储（用于图片）

1. 在 Storage 页面，点击 "Create Database"
2. 选择 "Blob"
3. 输入名称（如 `xphotoalbum-blob`）
4. 点击 "Create"
5. 创建完成后，点击 "Connect to Project"
6. 选择你的 xphotoalbum 项目
7. `BLOB_READ_WRITE_TOKEN` 会自动添加到环境变量

### 步骤 5: 添加环境变量

在 Vercel 项目页面，进入 "Settings" → "Environment Variables"，添加以下变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `NEXTAUTH_SECRET` | 随机字符串 | 运行 `openssl rand -base64 32` 生成 |
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 你的 Vercel 域名 |
| `ADMIN_EMAIL` | `xchkoo@foxmail.com` | 管理员邮箱 |
| `ADMIN_PASSWORD` | `XPhoto2026!@#` | 管理员密码（部署后建议修改） |

> ⚠️ 注意：`DATABASE_URL` 和 `BLOB_READ_WRITE_TOKEN` 已在上一步自动添加

### 步骤 6: 部署

1. 点击 "Deploy" 开始部署
2. 等待部署完成（约 2-3 分钟）
3. 部署成功后会显示你的网站 URL

### 步骤 7: 初始化管理员账号

部署完成后，需要初始化管理员账号。有两种方式：

#### 方式 1: 通过 Vercel CLI（推荐）

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 链接项目
vercel link

# 运行初始化脚本
vercel env pull .env.local
npm run init:admin
```

#### 方式 2: 通过 API

首次访问后台登录页面时，如果检测到没有管理员账号，可以创建新账号。

## 📱 功能介绍

### 前台功能
- 🖼️ 首页 Hero 大图展示
- 📸 精选作品网格展示
- 🏷️ 按分类筛选（人像、风景、美食等 12 种分类）
- 🔍 图片灯箱查看大图
- 📱 响应式设计，支持手机/平板/桌面

### 后台功能
- 🔐 管理员登录认证
- 📊 仪表盘统计
- 📷 作品管理（上传、编辑、删除、设为精选）
- 📁 专辑管理（创建、编辑、删除）
- ⚙️ 网站设置（首页图片、标题、描述）

## 🎨 照片分类

| 分类 ID | 中文名称 |
|---------|---------|
| portrait | 人像 |
| landscape | 风景 |
| food | 美食 |
| street | 街拍 |
| architecture | 建筑 |
| travel | 旅行 |
| animal | 动物 |
| night | 夜景 |
| macro | 微距 |
| event | 活动 |
| bw | 黑白 |
| film | 胶片 |

## 🔧 本地开发

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的配置

# 初始化数据库
npm run db:push

# 初始化管理员
npm run init:admin

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000

## 🔐 管理员账号

- **邮箱**: `xchkoo@foxmail.com`
- **密码**: `XPhoto2026!@#`

> ⚠️ 部署后请尽快在后台修改密码！

## 📝 后续优化建议

1. **自定义域名**: 在 Vercel 项目设置中添加自定义域名
2. **图片优化**: 考虑使用 Cloudinary 替代 Vercel Blob 获得更多图片处理功能
3. **SEO 优化**: 添加 sitemap.xml 和 robots.txt
4. **分析统计**: 集成 Google Analytics 或 Vercel Analytics
5. **CDN 加速**: 如果使用自定义域名，可配置 CloudFlare CDN

## ❓ 常见问题

### Q: 部署后图片上传失败？
A: 确保 `BLOB_READ_WRITE_TOKEN` 环境变量已正确设置。

### Q: 登录后显示未授权？
A: 检查 `NEXTAUTH_SECRET` 和 `NEXTAUTH_URL` 是否正确配置。

### Q: 数据库连接失败？
A: 确认 Vercel Postgres 已正确连接到项目，`DATABASE_URL` 环境变量存在。

### Q: 如何修改管理员密码？
A: 登录后台后，可以在设置页面修改，或直接在数据库中修改 Admin 表。

## 📞 技术支持

- GitHub Issues: https://github.com/xchkoo-xclaw/xphotoalbum/issues
- 项目文档: 查看 `README.md`

---

Made with ❤️ by Xclaw 🦉
