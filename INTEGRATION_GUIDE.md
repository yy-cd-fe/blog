# Hexo + Next.js 集成指南

本指南将帮助你完全集成 Hexo 和 Next.js，实现最强大的博客系统。

## 📋 目录结构

```
yy-blog/
├── hexo-blog/              # 原有的 Hexo 项目
│   ├── source/
│   │   └── _posts/         # Markdown 文章
│   ├── themes/landscape/   # 自定义主题
│   ├── _config.yml
│   ├── package.json
│   └── public/             # 生成的静态文件
│
├── nextjs-blog/            # 新的 Next.js 项目
│   ├── pages/
│   │   ├── index.tsx       # 首页
│   │   ├── blog/           # 博文页面
│   │   ├── categories/     # 分类页面
│   │   ├── tags/           # 标签页面
│   │   ├── api/            # API 路由
│   │   └── _app.tsx
│   ├── components/         # React 组件
│   ├── lib/                # 工具函数
│   ├── styles/             # CSS 样式
│   ├── public/             # 静态资源
│   ├── next.config.js
│   ├── package.json
│   └── tsconfig.json
│
└── INTEGRATION_GUIDE.md    # 本文件
```

## 🚀 使用流程

### 1. 添加新文章

在 Hexo 项目中创建新文章：

```bash
cd ..
hexo new "文章标题"
```

编辑 `source/_posts/文章标题.md`

### 2. 生成静态文件

```bash
# 在 Hexo 项目中
hexo generate
```

这会生成 `public/` 目录下的静态文件

### 3. 启动 Next.js 开发服务器

```bash
cd nextjs-blog
npm run dev
```

访问 `http://localhost:3000`

## 🔗 集成方案

### 方案 A：直接读取 Markdown 文件（推荐用于小型博客）

优点：
- 简单直接
- 无需额外配置
- Markdown 文件可版本控制

实现：
```typescript
// lib/blog.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), '..', 'source', '_posts')

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory)
  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const content = fs.readFileSync(path.join(postsDirectory, file), 'utf8')
      const { data, excerpt } = matter(content)
      
      return {
        title: data.title,
        date: data.date,
        excerpt: excerpt || '',
        slug: file.replace('.md', ''),
        tags: data.tags || [],
        categories: data.categories || []
      }
    })
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
```

### 方案 B：使用 Hexo API 导出 JSON（推荐用于大型博客）

步骤：

1. 配置 Hexo 导出 JSON 文件

在 Hexo 的 `_config.yml` 中添加：

```yaml
jsonContent:
  meta: false
  pages: false
  posts:
    title: true
    date: true
    path: true
    text: true
    raw: false
    content: false
    slug: true
    comments: false
    categories: true
    tags: true
```

2. 安装 Hexo JSON 导出插件

```bash
npm install hexo-generator-json-content
```

3. 生成 JSON 文件

```bash
hexo generate
```

4. 在 Next.js 中读取 JSON

```typescript
// lib/blog.ts
import fs from 'fs'
import path from 'path'

export function getAllPosts() {
  const jsonPath = path.join(process.cwd(), '..', 'public', 'content.json')
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
  return data.posts
}
```

### 方案 C：Headless CMS 集成（最佳用于团队协作）

选择：
- Contentful
- Strapi
- Sanity
- Ghost

优点：
- 团队可以直接编辑内容
- 无需 Git 操作
- 自动发布流程

## 📝 实现步骤

### Step 1: 准备 Markdown 文件

确保你的文章 Front Matter 包含必要信息：

```markdown
---
title: React 状态管理指南
date: 2026-03-06
tags:
  - React
  - 状态管理
categories:
  - 技术
excerpt: 详细对比不同的 React 状态管理方案
---

文章内容...
```

### Step 2: 配置读取函数

在 `lib/blog.ts` 中实现上述任何一个方案

### Step 3: 更新页面

在 `pages/index.tsx` 中：

```typescript
import { getAllPosts } from '../lib/blog'

export async function getStaticProps() {
  const posts = getAllPosts()
  
  return {
    props: { posts },
    revalidate: 3600
  }
}
```

### Step 4: 创建动态路由

创建 `pages/blog/[slug].tsx`：

```typescript
import { getAllPosts, getPostBySlug } from '../../lib/blog'

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map(post => ({
      params: { slug: post.slug }
    })),
    fallback: 'blocking'
  }
}

export async function getStaticProps({ params }: any) {
  const post = getPostBySlug(params.slug)
  
  return {
    props: { post },
    revalidate: 3600
  }
}

export default function Post({ post }: any) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.date}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  )
}
```

## 🔄 自动化部署

### GitHub Actions 工作流

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Generate Hexo
      run: |
        cd ..
        npm install
        npm run build
    
    - name: Build Next.js
      run: |
        cd nextjs-blog
        npm install
        npm run build
    
    - name: Deploy to Vercel
      run: npx vercel --prod
      env:
        VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 📦 部署选项

### 选项 1: Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### 选项 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### 选项 3: 自托管

```bash
npm run build
npm install -g pm2
pm2 start "npm start" --name "blog"
```

## 🛠️ 故障排除

### 问题：文章无法加载

**解决：** 检查 `source/_posts` 路径是否正确

### 问题：样式不一致

**解决：** 在 `styles/globals.css` 中调整全局样式

### 问题：构建太慢

**解决：** 使用 ISR（Incremental Static Regeneration）

```typescript
export async function getStaticProps() {
  return {
    props: { /* ... */ },
    revalidate: 3600 // 每小时重新生成
  }
}
```

## 📚 更多资源

- [Next.js 文档](https://nextjs.org/docs)
- [Hexo 文档](https://hexo.io/docs/)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [Vercel 文档](https://vercel.com/docs)

## 🎉 完成！

现在你有了一个强大的 Hexo + Next.js 博客系统！

## 总结

| 功能 | Hexo | Next.js |
|------|------|---------|
| 内容生成 | ✅ | ❌ |
| 展示界面 | ✅ | ✅ |
| 交互功能 | ❌ | ✅ |
| API 路由 | ❌ | ✅ |
| SSR/SSG | ❌ | ✅ |
| 最佳性能 | ✅✅ | ✅✅ |

这个组合给了你最好的两个世界！
