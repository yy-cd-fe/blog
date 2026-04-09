---
title: SSR
date: 2026-04-01
categories:
  - SSR
tags:
  - Next.js
  - React
  - SSG
  - SSR
  - 数据获取
author: yangyu
---

## 定义

- SSR (Server-Side Rendering) - 服务端渲染
  服务器生成完整的 HTML
  首屏加载快,SEO 友好
  服务器压力大
- CSR (Client-Side Rendering) - 客户端渲染
  浏览器通过 JavaScript 渲染页面
  首屏加载慢,但后续交互流畅
  典型代表: SPA (Single Page Application)
- SSG (Static Site Generation) - 静态站点生成
  构建时预渲染
  性能最好
  适合内容不常变化的网站
- ISR (Incremental Static Regeneration) - 增量静态再生成
  SSG 的增强版
  可以在运行时更新静态页面
  Next.js 的特色功能
  Hydration - 同构渲染/水合
  SSR + CSR 的结合
  服务端渲染 HTML,客户端激活交互
  首屏快 + 交互流畅

## FAQ

### 服务端渲染和客户端渲染区别

服务端渲染和客户端渲染区别
最终的渲染都是在客户端完成的，服务端渲染只是在服务端生成html 我理解这部分损耗在客户端完成也是较低的
那么为什么说服务端渲染能大大的提升渲染性能
对于spa项目 原本的html文件是很小的。首页资源是通过root来慢慢加载和渲染的
那么提升的性能具体体现在哪里

#### 核心理解

是的,**最终的渲染都在客户端浏览器完成**。SSR 的性能优势不在于"渲染"这个动作本身,而在于**用户体验的关键时间节点**。

#### 加载流程对比

**SPA (客户端渲染) 的加载流程:**

```
1. 下载 HTML (几乎是空的,只有 <div id="root"></div>)
2. 解析 HTML
3. 下载 JavaScript bundle (可能很大,比如 500KB+)
4. 解析并执行 JS
5. React 创建虚拟 DOM
6. 可能还要发起 API 请求获取数据
7. 等待数据返回
8. React 渲染到 DOM
9. 用户看到内容 ⏱️ (可能 3-5 秒)
```

**SSR (服务端渲染) 的加载流程:**

```
1. 下载 HTML (已包含完整的 HTML 内容)
2. 解析 HTML
3. 用户看到内容 ⏱️ (可能 0.5-1 秒)
4. 下载 JavaScript (后台进行)
5. Hydration (React 接管 DOM)
6. 页面可交互
```

**关键差异:**

- SPA: 用户要等 3-5 秒才能看到**任何有意义的内容**
- SSR: 用户 0.5-1 秒就能看到**完整的页面内容**

#### 性能提升的具体体现

##### 1. 首屏时间 (FCP - First Contentful Paint)

用户感知的性能差异:

```
SPA: 白屏 → 白屏 → 白屏 → 白屏 → 突然显示内容
     0s     1s     2s     3s     4s

SSR: 完整内容显示 → 内容可交互
     0.5s           3s
```

用户不会在意"可交互"的时间,但**非常在意**什么时候能看到东西。

##### 2. 网络条件差的场景

假设用户在移动网络环境下(4G 或更差):

**SPA:**

```
下载 500KB 的 JS bundle (4G 网络可能需要 2-3 秒)
↓
还要执行 JS (可能 1-2 秒)
↓
还要请求 API 数据 (可能又是 1-2 秒)
↓
总计: 5-7 秒才能看到内容
```

**SSR:**

```
下载 50KB 的 HTML (已包含数据,0.5 秒)
↓
用户立即看到完整内容
```

##### 3. 低端设备的 JavaScript 执行性能

虽然"生成 HTML 的损耗在客户端完成也是较低的"对**高端设备**来说是对的,但考虑:

- **低端手机**: JavaScript 执行速度可能是高端设备的 5-10 倍慢
- **服务器**: 永远是高性能的,执行 React 渲染很快

**执行时间对比:**

| 环境       | 生成 HTML 的时间 |
| ---------- | ---------------- |
| 高端服务器 | 10ms             |
| 高端手机   | 50ms             |
| 低端手机   | 200-500ms        |

服务器把 HTML 生成好,低端设备只需要解析 HTML(很快),而不需要执行复杂的 JS。

##### 4. 实际场景的数字对比

**一个博客首页的加载对比:**

**SPA 方式:**

```
- HTML: 2KB
- JS Bundle: 300KB
- API 请求数据: 50KB
- 在 4G 网络 + 中端手机:
  * 下载 JS: 2 秒
  * 执行 JS: 1 秒
  * 请求数据: 1 秒
  * 渲染: 0.5 秒
  * 总计: 4.5 秒才看到内容
```

**SSR 方式:**

```
- HTML: 50KB (已包含数据和完整结构)
- JS Bundle: 300KB (后台加载,不阻塞显示)
- 在 4G 网络 + 中端手机:
  * 下载 HTML: 0.5 秒
  * 用户看到完整内容: 0.5 秒 ✓
  * JS 加载和 hydration: 3 秒 (后台完成)
  * 页面可交互: 3.5 秒
```

##### 5. SEO 和爬虫

虽然不是性能问题,但很重要:

- **SPA**: 搜索引擎爬虫可能看不到内容(虽然 Google 会执行 JS,但不保证)
- **SSR**: 爬虫直接拿到完整 HTML,SEO 完美

#### 总结

SSR/SSG 的性能优势不是"生成 HTML 更快",而是:

1. ✅ **用户更快看到内容** (FCP 指标)
2. ✅ **网络传输更少** (HTML 包含数据,减少 API 请求)
3. ✅ **低端设备友好** (服务器代劳了 JS 执行)
4. ✅ **感知性能更好** (不是白屏,是渐进式增强)
5. ✅ **SEO 友好** (爬虫直接拿到内容)

**关键点**: SSR 是用服务器的性能,换取客户端的快速首屏体验。对于内容型网站(博客、新闻、电商)来说,这个权衡非常值得!

#### Next.js 的最佳实践

以博客项目为例,使用 **SSG (Static Site Generation)** 比 SSR 更快:

```typescript
export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts();

  return {
    props: {
      posts,
    },
    revalidate: 60, // ISR: 每 60 秒重新生成
  };
};
```

- 构建时就生成好 HTML
- 用户访问时直接返回静态 HTML
- CDN 可以缓存
- **首屏时间可能只需要 100-200ms!**

---

## SSR 深度讲解

### 1. 服务器生成完整的 HTML

#### 什么是"完整的 HTML"?

**重要澄清: "完整"不是绝对的完整!**

"完整"指的是:
- ✅ **首屏必需的数据**: 用户打开页面立即需要看到的内容已经在 HTML 中了
- ✅ **已经通过 API 获取的数据**: 服务器已经调用数据库/API 取得的数据被序列化到 HTML 中
- ❌ **不是所有数据**: 页面可能还有很多数据需要后续加载 (比如翻页、搜索、异步加载)

**现实例子:**

```
页面要显示的数据:

1. 静态数据 (绝对必需)
   - 页面标题: "用户仪表盘"
   - 用户名: "张三"
   - 侧边栏导航
   ✅ SSR 一定包含在 HTML 中

2. 初始数据 (必需,但通过数据库/API 获取)
   - 首屏统计数据 (访问量、收入等)
   - 近 30 天的图表数据
   - 最近 10 条评论
   ✅ SSR 会在 HTML 中包含

3. 后续数据 (不是立即需要)
   - 历史数据 (前 1 年的数据)
   - 搜索结果 (用户搜索时才加载)
   - 评论分页 (点击"加载更多"时)
   - 实时消息 (通过 WebSocket)
   ❌ SSR 一般不包含,需要后续 API 请求
```

**SPA 的 HTML (不完整):**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
```

用户看到这个 HTML 时,页面上**什么都没有**。所有内容都需要通过 JavaScript 动态创建。

**SSR 的 HTML (完整):**

```html
<!DOCTYPE html>
<html>
  <head>
    <title>用户仪表盘 - MyApp</title>
    <meta name="description" content="查看你的统计数据">
  </head>
  <body>
    <div id="root">
      <!-- 服务器已经渲染好的完整内容 -->
      <div class="dashboard">
        <header>
          <h1>欢迎,张三</h1>
          <p>最后登录: 2026-04-07 10:30</p>
        </header>
        
        <div class="stats">
          <div class="stat-card">
            <h3>访问量</h3>
            <p class="number">1,234</p>
            <p class="change">↑ 12% vs 上周</p>
          </div>
          
          <div class="stat-card">
            <h3>收入</h3>
            <p class="number">¥5,678</p>
            <p class="change">↑ 8% vs 上周</p>
          </div>
          
          <div class="stat-card">
            <h3>活跃用户</h3>
            <p class="number">456</p>
            <p class="change">↓ 3% vs 上周</p>
          </div>
        </div>
        
        <div class="chart">
          <h3>每日访问趋势</h3>
          <svg><!-- 图表内容 --></svg>
        </div>
      </div>
    </div>
    
    <!-- 数据也被序列化到 HTML 中 -->
    <script id="__NEXT_DATA__" type="application/json">
    {
      "props": {
        "pageProps": {
          "user": {
            "name": "张三",
            "lastLogin": "2026-04-07 10:30"
          },
          "stats": {
            "visits": 1234,
            "revenue": 5678,
            "activeUsers": 456
          },
          "chartData": [...]
        }
      }
    }
    </script>
    
    <script src="/bundle.js"></script>
  </body>
</html>
```

#### 服务器生成过程

```typescript
// pages/dashboard.tsx
export default function Dashboard({ user, stats, chartData }) {
  return (
    <div className="dashboard">
      <header>
        <h1>欢迎,{user.name}</h1>
        <p>最后登录: {user.lastLogin}</p>
      </header>
      
      <div className="stats">
        <StatCard title="访问量" number={stats.visits} />
        <StatCard title="收入" number={stats.revenue} />
        <StatCard title="活跃用户" number={stats.activeUsers} />
      </div>
      
      <Chart data={chartData} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userId } = context.query
  
  // ===== 服务器端执行 =====
  // 步骤 1: 获取用户信息
  const user = await db.query('SELECT * FROM users WHERE id = ?', [userId])
  
  // 步骤 2: 获取统计数据
  const stats = await analytics.getStats(userId)
  
  // 步骤 3: 获取图表数据
  const chartData = await analytics.getChartData(userId)
  
  // 步骤 4: React 在服务器上渲染
  // 相当于执行: <Dashboard user={user} stats={stats} chartData={chartData} />
  // 生成 HTML 字符串: "<div class='dashboard'>...<h1>欢迎,张三</h1>...</div>"
  
  return {
    props: {
      user,
      stats,
      chartData,
    },
  }
}
```

**服务器的工作:**

```
用户请求 /dashboard?userId=123
  ↓
1. 执行 getServerSideProps
   ├─ 查询数据库: SELECT * FROM users (10ms)
   ├─ 查询分析数据库: 获取访问量、收入等 (20ms)
   ├─ 查询图表数据: 30 天的数据 (30ms)
   └─ 总计: 60ms
  ↓
2. 执行 React 渲染 (10ms)
   └─ <Dashboard user={user} stats={stats} chartData={chartData} />
   └─ 生成 HTML 字符串
  ↓
3. 返回完整 HTML 给浏览器 (总耗时 70ms)
```

#### 关键特点

- ✅ 服务器有完整的数据库访问权限
- ✅ 可以进行复杂的计算
- ✅ HTML 已经包含首屏必需的数据,可以立即显示
- ✅ 爬虫看到的是完整 HTML,不需要执行 JS

#### SSR 中后续数据如何处理?

**例子: 一个包含评论的文章页面**

```typescript
// pages/post/[id].tsx
export default function PostDetail({ post, comments, user }) {
  const [moreComments, setMoreComments] = useState([])
  const [loading, setLoading] = useState(false)
  
  // 初始评论已经从 SSR 中获得,直接显示
  const allComments = [...comments, ...moreComments]
  
  // 加载更多评论 (客户端需要发起新的 API 请求)
  const handleLoadMore = async () => {
    setLoading(true)
    const res = await fetch(`/api/posts/${id}/comments?page=2`)
    const data = await res.json()
    setMoreComments(data.comments)
    setLoading(false)
  }
  
  return (
    <div>
      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
      
      {/* 这些来自 SSR,已经在 HTML 中 */}
      <div className="comments">
        <h2>评论 ({comments.length})</h2>
        {comments.map(comment => (
          <div key={comment.id}>{comment.text}</div>
        ))}
      </div>
      
      {/* 这个按钮会触发新的 API 请求 */}
      <button onClick={handleLoadMore}>加载更多评论</button>
      
      {/* 新加载的评论 */}
      {moreComments.map(comment => (
        <div key={comment.id}>{comment.text}</div>
      ))}
    </div>
  )
}

export const getServerSideProps = async ({ params }) => {
  const { id } = params
  
  // 服务器只获取首屏必需的数据
  const post = await db.query('SELECT * FROM posts WHERE id = ?', [id])
  const comments = await db.query(
    'SELECT * FROM comments WHERE post_id = ? LIMIT 10',  // 只获取前 10 条
    [id]
  )
  const user = await getUser()
  
  return {
    props: {
      post,
      comments,    // ← 这 10 条评论会序列化到 HTML 中
      user,
    },
  }
}
```

**HTML 结构:**

```html
<html>
  <body>
    <div id="root">
      <article>
        <h1>如何学习 Next.js</h1>
        <p>Next.js 是一个...</p>
      </article>
      
      <!-- 来自 SSR 的首批评论 (已在 HTML 中) -->
      <div class="comments">
        <h2>评论 (10)</h2>
        <div class="comment">用户1: 很有帮助</div>
        <div class="comment">用户2: 谢谢分享</div>
        <!-- ... 共 10 条 ... -->
      </div>
      
      <button>加载更多评论</button>
    </div>
    
    <!-- 初始数据被序列化到 HTML -->
    <script id="__NEXT_DATA__" type="application/json">
    {
      "props": {
        "pageProps": {
          "post": { "title": "...", "content": "..." },
          "comments": [
            { "id": 1, "text": "用户1: 很有帮助" },
            { "id": 2, "text": "用户2: 谢谢分享" },
            ...
          ],
          "user": { "name": "张三" }
        }
      }
    }
    </script>
    
    <script src="/bundle.js"></script>
  </body>
</html>
```

**加载时序:**

```
SSR 初始加载:
0s:    用户访问 /post/123
       ↓
0.2s:  服务器执行 getServerSideProps
       ├─ 查询文章: SELECT * FROM posts (5ms)
       ├─ 查询前 10 条评论: SELECT * FROM comments (10ms)
       ├─ React 渲染: <PostDetail post={...} comments={...} /> (5ms)
       └─ 总计: 20ms
       ↓
0.3s:  返回完整 HTML
       ↓
0.4s:  用户看到文章和 10 条评论 ✓
       JS 在后台下载
       ↓
1.5s:  JS 加载完成,页面可交互


用户点击"加载更多评论":
1.5s:  用户点击按钮
       ↓
1.6s:  JavaScript 发起 API 请求: GET /api/posts/123/comments?page=2
       ↓
1.8s:  服务器返回第二页评论 (20ms)
       ↓
1.9s:  React 更新状态,显示新评论
       用户看到更多评论 ✓
```

#### "完整"的真实含义

| 对比项 | SPA | SSR |
|--------|-----|-----|
| 首屏数据在 HTML 中 | ❌ 否 | ✅ 是 |
| 分页数据在 HTML 中 | ❌ 否 | ❌ 否 |
| 搜索结果在 HTML 中 | ❌ 否 | ❌ 否 |
| 用户交互后的数据 | ❌ 否 | ❌ 否 |
| 后续需要 API 请求 | ✅ 全部 | ✅ 分页和后续操作 |

**核心区别:**
- **SPA**: 所有数据都需要通过 API 请求,包括首屏数据
- **SSR**: 只有首屏数据通过 HTML 交付,后续操作仍需 API 请求

**比喻:**
- **SPA** = 去书店买书,书店告诉你自己上架找 (完全没有预售)
- **SSR** = 去书店买书,书店已经把你要的热销书放在收银台了,其他书你还是要自己找 (预售热销品)

---

### 2. 首屏加载快,SEO 友好

#### 首屏加载快的具体表现

**例子: 电商网站首页**

对比时间轴:

```
SPA (客户端渲染):
0s:    用户点击链接
       浏览器开始加载页面
       ↓
0.2s:  HTML 到达 (2KB 空壳)
       浏览器开始下载 JS
       ↓
1.5s:  JS 下载完成 (500KB,4G 网络)
       浏览器开始执行 JS
       ↓
2.5s:  JS 执行完成,React 初始化
       发起 API 请求获取商品数据
       ↓
3.2s:  API 返回商品数据
       React 开始渲染
       ↓
3.5s:  页面显示 ← 用户终于看到商品列表! 😤
       ↓
4s:    JS 执行完成,页面可交互
       └─ 用户可以点击筛选、排序等

白屏时间: 3.5 秒 (用户能看到内容需要的时间)


SSR (服务端渲染):
0s:    用户点击链接
       浏览器开始加载页面
       ↓
0.2s:  服务器执行 getServerSideProps
       ├─ 查询数据库: 获取商品列表 (20ms)
       ├─ 过滤/排序/分页 (10ms)
       └─ 总计: 30ms
       ↓
0.3s:  React 渲染完整 HTML
       ↓
0.5s:  完整 HTML 到达浏览器
       浏览器解析 HTML
       ↓
0.6s:  页面显示 ← 用户立即看到商品列表! ✓
       浏览器开始下载 JS (后台进行)
       ↓
1.5s:  JS 下载完成
       React Hydration (激活交互)
       ↓
1.6s:  页面完全可交互
       └─ 用户可以点击筛选、排序等

白屏时间: 0.6 秒 (快了 6 倍!)
```

#### 真实的数据对比

根据谷歌的研究:

| 指标 | SPA | SSR | 改进 |
|------|-----|-----|------|
| FCP (首次内容绘制) | 3.5s | 0.6s | ⬇️ 83% |
| LCP (最大内容绘制) | 4.2s | 1.2s | ⬇️ 71% |
| TTI (可交互时间) | 4s | 1.6s | ⬇️ 60% |
| 用户跳出率 | 40% | 15% | ⬇️ 63% |

**发现:** 每延迟 100ms,转化率下降 1%!

#### SEO 友好的具体例子

**场景: Google 爬虫抓取网站**

**SPA 的情况:**

```
Google 爬虫访问 https://mystore.com
  ↓
收到 HTML:
<html>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>
  ↓
爬虫简单分析:
- 标题: 无
- 描述: 无
- 内容: 无
- 关键词: 无
  ↓
搜索结果:
- 排名: 很低
- 描述: [网站内容无法加载]
- 缩略图: 空白
```

**SSR 的情况:**

```
Google 爬虫访问 https://mystore.com
  ↓
收到 HTML:
<html>
  <head>
    <title>女性连衣裙 | 优雅时尚 | MyStore</title>
    <meta name="description" content="精选女性连衣裙,优雅大气的设计,舒适透气的面料,支持7天无理由退货">
    <meta name="keywords" content="连衣裙,女装,时尚">
  </head>
  <body>
    <div id="root">
      <h1>女性连衣裙</h1>
      <div class="product-grid">
        <div class="product">
          <img src="dress1.jpg">
          <h2>蓝色雪纺连衣裙</h2>
          <p>¥199</p>
        </div>
        <!-- 更多商品 -->
      </div>
    </div>
  </body>
</html>
  ↓
爬虫完整分析:
- 标题: "女性连衣裙 | 优雅时尚 | MyStore"
- 描述: "精选女性连衣裙..."
- 内容: 列出了 20 个女装商品
- 关键词: 连衣裙, 女装, 时尚
  ↓
搜索结果:
- 排名: 前 3 页
- 描述: "精选女性连衣裙,优雅大气的设计..."
- 缩略图: 清晰的商品图片
- 用户点击率: 很高
```

#### Open Graph 元数据示例

这个特别重要,在社交媒体分享时:

**SPA:**
```
用户分享 https://mystore.com/product/dress123 到微博
  ↓
微博爬虫收到的信息:
- 标题: 无
- 描述: 无
- 图片: 无
  ↓
微博显示:
[缺少 og:title]
[缺少 og:description]
[缺少 og:image]
```

**SSR:**
```
用户分享 https://mystore.com/product/dress123 到微博
  ↓
微博爬虫收到的信息:
<meta property="og:title" content="蓝色雪纺连衣裙 - MyStore">
<meta property="og:description" content="高级雪纺面料,舒适透气,¥199">
<meta property="og:image" content="dress123.jpg">
  ↓
微博显示:
[蓝色雪纺连衣裙 - MyStore]
高级雪纺面料,舒适透气,¥199
[商品图片]

点击率提高 300% !
```

---

### 3. 服务器压力大

#### 压力体现在哪里?

**对比场景: 一个热门电商网站**

假设每秒有 1000 个用户访问首页。

**SPA 的情况:**

```
用户 1 访问首页
  ↓
服务器返回空 HTML (2KB)
  ↓
用户下载 JS,在浏览器中渲染
  ↓
用户 2 访问首页
  ↓
服务器返回空 HTML (2KB)
  ↓
...

结果:
- 每个请求: 处理时间 10ms (只是返回静态文件)
- 1000 个并发请求: 10 秒能处理完
- 服务器 CPU 占用: 5%
- 内存占用: 100MB
```

**SSR 的情况:**

```
用户 1 访问首页
  ↓
服务器需要:
  1. 连接数据库
  2. 查询商品数据 (100ms)
  3. 过滤/排序 (50ms)
  4. React 渲染 (30ms)
  5. 生成 HTML (总计 180ms)
  ↓
服务器返回完整 HTML
  ↓
用户 2 访问首页 (同时)
  ↓
服务器需要重复上面的步骤
  ↓
...

结果:
- 每个请求: 处理时间 180ms (数据库查询 + 渲染)
- 1000 个并发请求: 光等待数据库响应就需要多秒
- 服务器 CPU 占用: 80%
- 内存占用: 500MB+
- 可能导致响应超时
```

#### 具体的服务器压力对比表

```
并发用户数    SPA 响应时间    SSR 响应时间    SSR 压力倍数
10           10ms           180ms          18x
100          10ms           180ms          18x
1000         10ms           2-5s           200-500x
10000        100ms          超时           ∞

服务器硬件配置:
- 4 核 8GB 内存

SPA:
- 可以轻松处理 10000+ 并发用户
- 主要瓶颈: 带宽,不是 CPU

SSR:
- 只能处理 100-200 并发用户
- 主要瓶颈: CPU 和数据库连接池
```

#### 压力的具体来源

**1. 数据库查询**

```typescript
// 每个请求都要执行
export const getServerSideProps = async () => {
  // ❌ 这会重复执行 1000 次
  const products = await db.query(
    'SELECT * FROM products WHERE category = ? LIMIT 20',
    ['女装']
  )
  
  // 数据库压力: 1000 queries/second
  // 数据库连接池很快耗尽
  // 后续请求开始排队等待
}
```

**2. React 渲染**

```typescript
export const getServerSideProps = async () => {
  const products = await getProducts()
  
  // ❌ 每个请求都要完整的 React 渲染
  // Node.js 是单线程的,不能并行处理
  // 1000 个请求 = 需要 1000 * 30ms = 30 秒
}
```

**3. 内存占用**

```
每个请求的内存占用:
- React 运行时: 2MB
- props 数据: 200KB
- Node.js 开销: 1MB
- 总计: ~3.2MB

1000 并发请求: 1000 * 3.2MB = 3.2GB
服务器总内存: 8GB
剩余内存: 4.8GB

当并发继续上升...
服务器内存耗尽 → OOM Kill → 进程崩溃
```

#### 解决方案

**1. 使用 CDN 缓存**

```typescript
export const getServerSideProps = async (context) => {
  // 设置缓存头
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=60, stale-while-revalidate=300'
  )
  
  const products = await getProducts()
  return { props: { products } }
}
```

这样只有第一个用户触发渲染,其他 59 秒内的请求直接返回缓存。

**2. 改用 SSG + ISR**

```typescript
// ✅ 这样做不会有服务器压力!
export const getStaticProps = async () => {
  const products = await getProducts()
  return {
    props: { products },
    revalidate: 60, // 60 秒后重新生成
  }
}
```

- 构建时执行一次 (不是请求时)
- 生成静态 HTML 文件
- 所有用户返回同一个文件
- 零服务器压力

**3. 使用 Edge 计算**

```typescript
// 在 CDN 边缘节点执行
export const getServerSideProps = async () => {
  // 运行在全球各地的 CDN 节点
  // 分散压力
}
```

**4. 增加服务器资源**

```
1 台 4 核 8GB 服务器:
- 可处理 100-200 并发 SSR

10 台 16 核 32GB 服务器 + 负载均衡:
- 可处理 1000-2000 并发 SSR
- 成本增加 10 倍
- 部署复杂度增加 10 倍
```

---

## SSR vs SSG + ISR

### 为什么说 SSG + ISR 更好?

```
SSR:
每次请求 → 查询数据库 → 渲染 HTML
服务器压力: 大

SSG + ISR:
构建时 → 查询数据库一次 → 生成 HTML
60 秒后:
  第一个请求 → 返回旧 HTML + 后台重新生成
  其他请求 → 返回新 HTML
服务器压力: 极小
```

### 选择指南

```
使用 SSR 当:
- 内容实时变化 (股票行情、实时评论)
- 用户个性化 (用户仪表盘、推荐)
- 无法预测 URL (动态复杂查询)

使用 SSG + ISR 当:
- 内容相对稳定 (博客、文档)
- 所有用户内容相同 (产品列表)
- 可以预测 URL (商品分类页)

结果:
- SSR: 性能好但贵
- SSG + ISR: 性能好且便宜 ← 推荐!
```

你的博客用 SSG + ISR 是完全正确的选择! 🎯
