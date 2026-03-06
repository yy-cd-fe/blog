# Hexo + Next.js 混合博客系统

这是一个结合 Hexo 和 Next.js 优势的现代博客系统。

## 🏗️ 架构

```
yy-blog/
├── hexo-blog/              # Hexo 项目（内容生成）
│   ├── source/_posts/      # 博客文章（Markdown）
│   ├── themes/landscape/   # 主题
│   └── public/             # 生成的静态文件
│
└── nextjs-blog/            # Next.js 项目（展示层）
    ├── pages/              # 页面和 API 路由
    ├── components/         # React 组件
    ├── styles/             # CSS 样式
    └── public/             # 静态资源
```

## 🚀 快速开始

### 1. 生成 Hexo 内容

```bash
# 进入 Hexo 项目
cd ..

# 生成静态文件
npm run build

# 或者
hexo generate
```

### 2. 启动 Next.js 开发服务器

```bash
# 进入 Next.js 项目
cd nextjs-blog

# 安装依赖（如果还没有）
npm install

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`

### 3. 生产构建

```bash
npm run build
npm run start
```

## 📝 工作流程

### 添加新文章

```bash
# 在 Hexo 项目中
hexo new "文章标题"

# 编辑文章
vim source/_posts/文章标题.md

# 生成静态文件
hexo generate
```

### 自定义页面

在 `pages/` 目录下创建新的 `.tsx` 或 `.jsx` 文件

### 创建 API 路由

在 `pages/api/` 目录下创建新的文件

```typescript
// pages/api/example.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ message: 'Hello' })
}
```

## 🎨 自定义

### 修改样式

编辑 `styles/` 目录下的 CSS 文件

### 修改布局

编辑 `components/Layout.tsx`

### 修改菜单

编辑 `components/Header.tsx` 中的 `MENU_ITEMS`

## 📦 依赖

- Next.js 14+
- React 18+
- TypeScript

## 🔗 集成 Hexo

要将 Hexo 生成的文件集成到 Next.js，你需要：

1. 配置 Hexo 输出到正确的目录
2. 创建一个脚本来读取 Hexo 生成的数据
3. 在 Next.js 的 `getStaticProps` 中使用这些数据

## 🚀 部署

### Vercel（推荐）

```bash
npm install -g vercel
vercel
```

### 其他平台

```bash
npm run build
# 将 `.next` 目录上传到服务器
```

## 📚 资源

- [Next.js 文档](https://nextjs.org/docs)
- [Hexo 文档](https://hexo.io/docs/)
- [React 文档](https://react.dev)

## 📄 许可

MIT
