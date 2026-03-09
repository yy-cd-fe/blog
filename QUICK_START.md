# 🚀 快速启动指南

## 项目概览

这是一个采用 **Next.js + Markdown** 的现代化博客系统。后端基于 Next.js 的静态生成（SSG）能力直接读取 Markdown 文件，无需 Hexo 构建过程。

## 架构

```
source/_posts/     ← Markdown 文章存放处
    ├── hello-world.md
    └── react-state-machine.md

nextjs-blog/       ← Next.js 应用
    ├── lib/hexo-reader.ts    ← 核心：Markdown 读取器
    ├── pages/
    │   ├── index.tsx         ← 首页（最新 5 篇）
    │   ├── blog/
    │   │   ├── index.tsx      ← 文章列表
    │   │   └── [slug].tsx     ← 单篇文章
    │   ├── categories/
    │   │   ├── index.tsx      ← 分类列表
    │   │   └── [category].tsx ← 分类下的文章
    │   └── tags/
    │       ├── index.tsx      ← 标签云
    │       └── [tag].tsx      ← 标签下的文章
    └── styles/               ← CSS Modules 样式文件
```

## 💻 本地开发

### 1. 安装依赖

```bash
cd nextjs-blog
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看博客

### 3. 创建新文章

在 `source/_posts/` 目录下创建新的 `.md` 文件：

```markdown
---
title: 我的第一篇文章
date: 2024-01-15
categories:
  - 技术
tags:
  - Next.js
  - React
author: Your Name
---

## 内容

这是文章的正文...
```

**立即生效**：热更新会自动识别新文件（开发模式）

### 4. 编辑文章

修改 `source/_posts/*.md` 文件后，开发服务器会自动重新加载。

## 📦 生产构建

### 构建静态站点

```bash
npm run build
```

此命令会：
- 读取所有 Markdown 文件
- 为每篇文章生成 HTML
- 为分类和标签列表生成 HTML
- 输出到 `.next/standalone` 目录

### 本地预览构建结果

```bash
npm run build
npm run start
```

访问 `http://localhost:3000` 查看生产版本

## 🌐 部署

### 部署到 Vercel（推荐）

1. 项目推送到 GitHub
2. 访问 [vercel.com](https://vercel.com)
3. 导入项目，选择 `nextjs-blog` 目录作为根目录
4. Vercel 会自动配置 Next.js 构建选项
5. 每次推送到主分支时自动部署

### 部署到 GitHub Pages

1. 在 package.json 中添加 export 脚本：

```json
{
  "scripts": {
    "build": "next build",
    "export": "npm run build && next export"
  }
}
```

2. 构建并导出静态文件：

```bash
npm run export
```

3. 将 `out` 目录的内容推送到 `gh-pages` 分支

### 其他静态托管服务

项目可部署到任何支持静态网站的服务：
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront
- 自己的服务器 (Apache/Nginx)

## 📝 Markdown 语法支持

### Front Matter 格式

必填字段：
- `title`: 文章标题

可选字段：
- `date`: 发布日期（格式：`YYYY-MM-DD` 或 `YYYY-MM-DD HH:mm:ss`）
- `categories`: 分类数组
- `tags`: 标签数组
- `author`: 作者名字

### 支持的 Markdown 语法

✅ 标题 (`# H1` 到 `###### H6`)
✅ 列表 (有序 / 无序)
✅ 代码块 (包含代码高亮)
✅ 链接和图片
✅ 表格
✅ 引用块
✅ 加粗、斜体、删除线
✅ 水平线

### 代码高亮

```javascript
// 支持多种语言的代码块
function hello() {
  console.log('Hello, World!');
}
```

## 🎨 自定义样式

### 修改主题颜色

编辑 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',    // 主色调
        secondary: '#6b7280',  // 次色调
        // ... 其他颜色
      }
    }
  }
}
```

### 添加自定义 CSS

编辑或创建 CSS Modules 文件，例如 `styles/custom.module.css`

### 修改首页标语

编辑 `pages/index.tsx`：

```tsx
<h1>你的博客标题</h1>
<p>你的副标题或简介</p>
```

## 📊 SEO 优化

项目已包含基本的 SEO 支持：

- ✅ 文章标题用作 `<title>` 标签
- ✅ 文章摘要用作 `<meta description>`
- ✅ 动态路由生成标准的 URL 结构
- ✅ 所有页面预生成为 HTML（有利于搜索引擎爬虫）

**建议添加**：
- 使用 `next-seo` 库增强 SEO 功能
- 生成 `sitemap.xml` 和 `robots.txt`
- 添加 Open Graph 元标签

## 🔍 常见问题

### Q: 新文章添加后没有显示
**A**: 
- 开发模式：页面会自动刷新
- 生产模式：需要重新运行 `npm run build`

### Q: 如何修改导航菜单？
**A**: 编辑 `components/Header.tsx` 中的 `MENU_ITEMS` 数组

### Q: 如何修改页脚？
**A**: 编辑 `components/Footer.tsx` 文件

### Q: 如何添加评论功能？
**A**: 可以集成：
- Giscus（基于 GitHub Discussions）
- Utterances（基于 GitHub Issues）
- Disqus

### Q: 如何添加搜索功能？
**A**: 可以使用：
- Algolia（云端搜索）
- 本地索引 + 前端搜索
- FlexSearch

### Q: 博客速度很慢
**A**:
- 确保使用了 Next.js Image 优化
- 检查是否有大的 JavaScript 包
- 在 Vercel 上部署可获得全球 CDN 加速

## 📚 项目结构详解

```
nextjs-blog/
├── pages/              # Next.js 页面和路由
│   ├── api/            # API 路由
│   ├── blog/           # 文章相关页面
│   ├── categories/     # 分类相关页面
│   ├── tags/           # 标签相关页面
│   ├── index.tsx       # 首页
│   ├── _app.tsx        # App 配置
│   └── 404.tsx         # 404 页面
├── components/         # React 组件
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx
│   └── *.tsx
├── lib/                # 工具函数和库
│   └── hexo-reader.ts  # ⭐ 核心 Markdown 读取器
├── styles/             # CSS Modules 样式
│   ├── Home.module.css
│   ├── blog.module.css
│   ├── post.module.css
│   ├── categories.module.css
│   ├── tags.module.css
│   └── globals.css
├── public/             # 静态资源
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🚀 性能指标

使用本架构构建的博客通常具有：
- ⚡ **首屏加载**: < 1s（预生成 HTML）
- 🎯 **灯塔分数**: 95+ （所有指标）
- 📱 **移动友好**: 100%
- 🔍 **SEO 就绪**: 预生成 HTML

## 📖 学习资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [React 官方文档](https://react.dev)
- [Markdown 语法指南](https://www.markdownguide.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

## 🤝 贡献

欢迎提交问题和建议！

## 📄 许可证

MIT License

---

**祝你使用愉快！** 🎉

有任何问题，请查看完整的实现文档：[SCHEME_B_IMPLEMENTATION.md](./SCHEME_B_IMPLEMENTATION.md)
