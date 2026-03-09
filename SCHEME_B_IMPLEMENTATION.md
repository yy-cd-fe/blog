# 方案 B：Next.js 直接读取 Markdown + Vercel 部署

## 概述
项目已成功改造为**方案 B**：采用 Next.js 直接读取 `source/_posts` 目录中的 Markdown 文件，而无需使用 Hexo 进行构建。

## 核心改造

### 1. Markdown 读取库 (`lib/hexo-reader.ts`)
- **功能**：使用 `gray-matter` 解析 Front Matter，使用 `remark` 转换 Markdown 为 HTML
- **主要函数**：
  - `getAllPosts()`: 获取所有文章列表（预览信息）
  - `getPostBySlug(slug)`: 获取单篇文章详细内容和 HTML
  - `getAllCategories()`: 获取所有分类
  - `getAllTags()`: 获取所有标签
  - `getPostsByCategory(category)`: 按分类过滤文章
  - `getPostsByTag(tag)`: 按标签过滤文章
  - `getAllPostSlugs()`: 获取所有文章 slug（用于生成静态路由）

### 2. 页面结构

#### 文章相关页面
- `/pages/blog/index.tsx`: 文章列表页面
- `/pages/blog/[slug].tsx`: 单篇文章详情页面（动态路由）

#### 分类相关页面
- `/pages/categories/index.tsx`: 分类列表页面
- `/pages/categories/[category].tsx`: 单个分类下的文章列表

#### 标签相关页面
- `/pages/tags/index.tsx`: 标签页面（标签云）
- `/pages/tags/[tag].tsx`: 单个标签下的文章列表

#### 首页
- `/pages/index.tsx`: 首页显示最新 5 篇文章

### 3. 样式文件

新增 CSS Modules 文件：
- `styles/blog.module.css`: 文章列表和分类文章列表页面样式
- `styles/post.module.css`: 单篇文章详情页面样式（包含 Markdown 内容样式）
- `styles/categories.module.css`: 分类页面样式
- `styles/tags.module.css`: 标签页面样式

### 4. 路径别名配置

在 `tsconfig.json` 中添加了路径别名支持：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

## 文章 Front Matter 格式

Markdown 文件应包含以下 Front Matter：

```markdown
---
title: 文章标题
date: 2024-01-01
categories:
  - 技术
tags:
  - React
  - Next.js
author: 作者名称
---

文章内容...
```

## 文件路径

所有 Markdown 文章应放在 `source/_posts` 目录下，文件名将被用作 URL slug：

```
source/_posts/
├── hello-world.md              → /blog/hello-world
├── react-state-machine.md      → /blog/react-state-machine
└── nextjs-guide.md             → /blog/nextjs-guide
```

## 构建和部署

### 本地开发
```bash
npm run dev
```

访问地址：`http://localhost:3000`

### 本地构建
```bash
npm run build
```

所有动态路由会在构建时预生成为静态 HTML 文件，这使得：
- ✅ 首次访问页面速度超快（无需服务器渲染）
- ✅ 可部署到 GitHub Pages、Vercel 等静态网站托管服务
- ✅ SEO 友好（爬虫可直接抓取预生成的 HTML）

### ISR (增量静态重新生成)

每个页面都配置了 ISR 参数：
- 文章列表页面：每 60 秒重新生成一次
- 文章详情页面：每 3600 秒（1 小时）重新生成一次
- 分类/标签页面：每 60 秒重新生成一次

这意味着：
- 新发布的文章会在 60 秒内自动出现在列表中（无需重新部署）
- 编辑文章后的更改在 3600 秒内会自动生效

### Vercel 部署

1. 项目已兼容 Vercel 部署要求
2. 推送到 GitHub 后，使用 Vercel 导入项目
3. Vercel 会自动检测 Next.js 项目并配置构建选项
4. 每次推送到主分支时，自动重新构建并部署

## Markdown 内容渲染

### HTML 生成流程
1. 读取 `.md` 文件
2. 使用 `gray-matter` 分离 Front Matter 和内容
3. 使用 `remark` 和 `remark-html` 转换 Markdown 为 HTML
4. 在详情页面使用 `dangerouslySetInnerHTML` 渲染 HTML

### 支持的 Markdown 语法
- 标题 (`# Heading`)
- 列表 (无序/有序)
- 代码块 (含代码高亮）
- 链接和图片
- 表格
- 引用块
- 加粗/斜体等

### CSS 样式
所有 Markdown 生成的 HTML 元素都已通过 CSS Modules 样式化，包括：
- 代码块背景和颜色
- 链接样式
- 图片圆角和阴影
- 表格边框和背景
- 引用块样式

## 与 Hexo 的关系

改造后的系统不再依赖 Hexo 的构建：
- ✅ Markdown 文件仍存放在标准的 `source/_posts` 目录
- ✅ 可以继续使用 Hexo 命令行工具管理文章
- ❌ Hexo 的生成输出不再被使用
- ❌ Hexo 的主题系统不再被使用

## 优势对比

### 相比原方案 A（Hexo 生成 HTML）
1. **更灵活**：可以在 Next.js 中使用动态功能和交互
2. **快速迭代**：修改 Markdown 后无需手动运行 Hexo 构建
3. **更现代**：使用 React 组件而不是传统的静态 HTML
4. **更好的开发体验**：完整的 TypeScript 支持

### 相比传统的 SSR 方案
1. **性能更高**：页面预生成，无服务器查询成本
2. **部署更简单**：可以部署到静态网站托管服务
3. **成本更低**：无需运维服务器

## 后续扩展

### 可添加的功能
- 评论系统（使用 Giscus、Utterances 等）
- 搜索功能（使用 Algolia 或本地索引）
- 阅读进度条
- 目录（Table of Contents）
- 相关文章推荐
- 深色模式主题切换
- 文章预计阅读时间

### 性能优化
- 图片优化（Next.js Image 组件）
- 代码分割和懒加载
- 字体优化
- CDN 缓存策略

## 故障排除

### 问题：新添加的 Markdown 文件在构建后不显示
**解决方案**：重新运行 `npm run build`，静态页面需要在构建时预生成

### 问题：文章内容不显示，只显示 HTML 标签
**解决方案**：这是正常的（HTML 正确渲染）。如果显示了原始 HTML 标签，检查 `dangerouslySetInnerHTML` 是否正确配置

### 问题：分类或标签列表为空
**解决方案**：确保 Markdown 的 Front Matter 中包含 `categories` 和 `tags` 字段

## 参考资源

- [Next.js 静态生成文档](https://nextjs.org/docs/basic-features/pages)
- [gray-matter - Front Matter 解析](https://github.com/jonschlinkert/gray-matter)
- [remark - Markdown 处理器](https://github.com/remarkjs/remark)
- [Vercel 部署指南](https://vercel.com/docs)
