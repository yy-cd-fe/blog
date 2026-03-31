---
title: Next.js 完全指南：从路由到数据获取
date: 2026-03-10 10:00:00
categories:
  - 前端框架
tags:
  - Next.js
  - React
  - SSG
  - SSR
  - 数据获取
author: yangyu
---

## 前言

Next.js 是构建现代 Web 应用最流行的 React 框架。它提供了开箱即用的特性，包括文件系统路由、内置优化、以及多种数据获取方式。本文将详细介绍 Next.js 的核心概念和最佳实践。

## 第一部分：路由规则

### 1. 文件系统路由

Next.js 的路由基于文件系统，`pages/` 目录的结构直接映射到 URL：

```
pages/
├── index.tsx              → /
├── about.tsx              → /about
├── blog/
│   ├── index.tsx          → /blog
│   └── [slug].tsx         → /blog/:slug （动态路由）
├── categories/
│   ├── index.tsx          → /categories
│   └── [category].tsx     → /categories/:category
└── api/
    └── posts.ts           → /api/posts （API 路由）
```

### 2. 动态路由（Dynamic Routes）

动态路由用 `[parameter]` 语法表示：

```typescript
// pages/blog/[slug].tsx
export default function BlogPost({ post }: { post: Post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}

// 访问 /blog/hello-world 时，slug = 'hello-world'
// 访问 /blog/react-guide 时，slug = 'react-guide'
```

### 3. 嵌套动态路由

多个动态段可以嵌套：

```typescript
// pages/[category]/[slug].tsx
export default function Post({ params }: { params: { category: string; slug: string } }) {
  return <div>分类: {params.category}, 文章: {params.slug}</div>
}

// 访问 /tech/react-hooks → { category: 'tech', slug: 'react-hooks' }
```

### 4. 可选路由段

使用 `[[...segments]]` 创建可选的嵌套路由：

```typescript
// pages/docs/[[...slug]].tsx
export default function Docs({ params }: { params?: { slug: string[] } }) {
  const path = params?.slug?.join('/') || 'introduction'
  return <div>文档: {path}</div>
}

// /docs → slug 不存在
// /docs/getting-started → slug: ['getting-started']
// /docs/guides/react → slug: ['guides', 'react']
```

## 第二部分：关键函数详解

### 1. GetStaticProps（静态生成）

在**构建时**运行，预先生成页面的静态 HTML：

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 构建时执行（只执行一次）
  const post = await getPostBySlug(params?.slug as string)

  if (!post) {
    return { notFound: true }  // 返回 404
  }

  return {
    props: { post },           // 传给页面组件
    revalidate: 3600           // ISR：1 小时后重新生成
  }
}

export default function BlogPost({ post }: { post: Post }) {
  return <article>{post.title}</article>
}
```

**特点**：
- ✅ 极快（直接返回预生成的 HTML）
- ✅ 低成本（无需服务器计算）
- ✅ 可 CDN 缓存
- ❌ 构建时需要知道所有页面
- ❌ 数据更新需要重新构建

### 2. GetServerSideProps（服务器渲染）

在**每次请求时**在服务器上运行：

```typescript
export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  // 每次请求都执行
  const post = await getPostBySlug(params?.slug as string)

  // 可以设置缓存头
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: { post },
    // 注意：没有 revalidate 属性
  }
}

export default function BlogPost({ post }: { post: Post }) {
  return <article>{post.title}</article>
}
```

**特点**：
- ✅ 实时数据（每次请求都获取）
- ✅ 可访问请求头和 Cookie
- ❌ 速度慢（每次都计算）
- ❌ 服务器成本高
- ❌ 不能静态化

### 3. GetStaticPaths（动态路由的路径生成）

告诉 Next.js 哪些动态路由需要预生成：

```typescript
export const getStaticPaths: GetStaticPaths = async () => {
  // 构建时运行，决定预生成哪些页面
  const slugs = await getAllPostSlugs()  // ['hello-world', 'react-guide', ...]

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking'  // 未预生成的路由在请求时生成
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostBySlug(params?.slug as string)
  return { props: { post }, revalidate: 3600 }
}

export default function BlogPost({ post }: { post: Post }) {
  return <article>{post.title}</article>
}
```

**fallback 选项**：
- `false`: 未预生成的路由返回 404
- `true`: 返回缓存版本，后台生成新页面
- `'blocking'`: 等待页面生成后返回（推荐）

### 4. ISR（增量静态重新生成）

使用 `revalidate` 参数实现增量更新：

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts()

  return {
    props: { posts },
    revalidate: 60  // 60 秒后重新生成
  }
}
```

**ISR 工作流**：

```
用户第一次访问
├─ 返回预生成的 HTML（极快）
└─ 缓存 60 秒

60 秒后用户访问
├─ 返回旧的 HTML（仍然快）
├─ 后台调用 getStaticProps()
└─ 重新生成页面

下一个用户访问
└─ 看到最新内容 ✓
```

## 第三部分：SSG vs SSR 详细对比

### 性能对比

| 方面 | SSG | SSR |
|------|-----|-----|
| **首字节时间** | < 100ms | 300ms - 2s |
| **构建时间** | 长（预生成所有页面） | 短（只构建代码） |
| **请求响应** | 极快（返回文件） | 较慢（服务器处理） |
| **服务器资源** | 低（只提供静态文件） | 高（每次都计算） |
| **CDN 支持** | 完美 | 部分 |

### 数据更新对比

**SSG + ISR**：
```
构建时: 预生成页面
运行时: 60秒后自动更新
特点: 快速响应 + 定期更新
```

**SSR**：
```
每次请求: 重新获取数据
运行时: 实时更新
特点: 最新数据 + 较慢响应
```

### 选择指南

#### 使用 SSG 的场景

✅ **博客文章** - 内容不经常变化
```typescript
export const getStaticProps = async () => {
  const posts = await getAllPosts()
  return { props: { posts }, revalidate: 86400 }  // 1 天
}
```

✅ **产品列表** - 更新频率可控
```typescript
export const getStaticProps = async () => {
  const products = await getProducts()
  return { props: { products }, revalidate: 3600 }  // 1 小时
}
```

✅ **文档页面** - 内容稳定
```typescript
export const getStaticProps = async () => {
  const docs = await getDocs()
  return { props: { docs }, revalidate: 604800 }  // 1 周
}
```

#### 使用 SSR 的场景

❌ **个人信息页** - 需要认证
```typescript
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getUser(req.cookies.token)
  return { props: { user } }
}
```

❌ **实时数据** - 不能预生成
```typescript
export const getServerSideProps: GetServerSideProps = async () => {
  const liveData = await getLiveData()  // 每次都获取最新
  return { props: { liveData } }
}
```

❌ **用户生成内容** - 内容不断变化
```typescript
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const comments = await getComments(params?.postId)
  return { props: { comments } }
}
```

## 第四部分：实战示例

### 完整的博客文章页面

```typescript
// pages/blog/[slug].tsx
import { GetStaticProps, GetStaticPaths } from 'next'
import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'

interface Props {
  post: Post
  readingTime: number
}

export default function BlogPost({ post, readingTime }: Props) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div className="meta">
        <span>📅 {post.date}</span>
        <span>⏱️ {readingTime} 分钟阅读</span>
      </div>
      <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />
    </article>
  )
}

// 告诉 Next.js 需要预生成哪些页面
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking'  // 新文章自动生成
  }
}

// 为每个页面生成数据
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlug(slug)

  if (!post) {
    return { notFound: true }
  }

  const readingTime = Math.ceil(post.content.length / 300)

  return {
    props: { post, readingTime },
    revalidate: 3600  // 1 小时后重新生成
  }
}
```

### 带有搜索参数的 SSR 页面

```typescript
// pages/search.tsx
import { GetServerSideProps } from 'next'

interface Props {
  results: Post[]
  query: string
}

export default function Search({ results, query }: Props) {
  return (
    <div>
      <h1>搜索结果: {query}</h1>
      <div>
        {results.map(post => (
          <article key={post.slug}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  const searchQuery = query.q as string

  if (!searchQuery) {
    return {
      props: { results: [], query: '' }
    }
  }

  const results = await searchPosts(searchQuery)

  return {
    props: { results, query: searchQuery }
  }
}
```

### 混合方案：SSG + 客户端数据获取

```typescript
// pages/trending.tsx
import { GetStaticProps } from 'next'
import { useEffect, useState } from 'react'

interface Props {
  initialPosts: Post[]
}

export default function Trending({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // 客户端获取最新数据
    async function fetchLatest() {
      setLoading(true)
      const res = await fetch('/api/trending')
      const data = await res.json()
      setPosts(data)
      setLoading(false)
    }

    fetchLatest()
  }, [])

  return (
    <div>
      <h1>热门文章 {loading && '...'}</h1>
      {posts.map(post => (
        <article key={post.slug}>{post.title}</article>
      ))}
    </div>
  )
}

// 构建时预生成初始数据
export const getStaticProps: GetStaticProps<Props> = async () => {
  const initialPosts = await getTrendingPosts()

  return {
    props: { initialPosts },
    revalidate: 60  // 60 秒后重新生成
  }
}
```

## 第五部分：最佳实践

### 1. 选择合适的数据获取方式

```typescript
// ✅ 好：区分 SSG 和 SSR
// 大部分页面用 SSG
export const getStaticProps = async () => { ... }

// 只在必要时用 SSR
export const getServerSideProps = async () => { ... }
```

### 2. 合理设置 `revalidate` 值

```typescript
// 内容不常变化
revalidate: 86400  // 1 天

// 内容经常变化
revalidate: 300    // 5 分钟

// 需要最新数据
revalidate: 10     // 10 秒
```

### 3. 利用 ISR 处理新内容

```typescript
// 使用 fallback: 'blocking' 自动处理新路由
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [...],
    fallback: 'blocking'  // ✅ 推荐
  }
}
```

### 4. 错误处理

```typescript
export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const post = await getPostBySlug(params?.slug as string)

    if (!post) {
      return { notFound: true }  // 返回 404
    }

    return {
      props: { post },
      revalidate: 3600
    }
  } catch (error) {
    return {
      redirect: {
        destination: '/error',
        permanent: false
      }
    }
  }
}
```

## 总结

| 特性 | SSG | SSR | 客户端 |
|------|-----|-----|--------|
| **性能** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **实时性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SEO** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **成本** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

**建议**：
1. 优先使用 SSG（通过 ISR 实现更新）
2. 对于实时数据或个性化内容使用 SSR
3. 利用客户端数据获取补充动态内容
4. 混合多种方案以获得最优性能和用户体验

## 参考资源

- [Next.js 官方文档](https://nextjs.org/docs)
- [数据获取文档](https://nextjs.org/docs/basic-features/data-fetching)
- [路由文档](https://nextjs.org/docs/routing/introduction)

---

通过掌握这些核心概念，你就能够高效地使用 Next.js 构建高性能的现代 Web 应用！
