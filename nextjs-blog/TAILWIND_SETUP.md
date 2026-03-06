# Tailwind CSS 配置和使用

本文档详细说明如何在项目中使用 Tailwind CSS + CSS Modules。

## 📦 已安装的包

```json
{
  "devDependencies": {
    "tailwindcss": "^3.x",
    "postcss": "^8.x",
    "autoprefixer": "^10.x"
  }
}
```

## ⚙️ 配置文件

### 1. tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 扫描所有 Pages 和 Components
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  
  // 主题扩展
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#666',
        border: '#e0e0e0',
        background: '#f9f9f9',
        text: '#333',
      },
      // 自定义字体堆栈
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', '...'],
        mono: ['Courier New', 'monospace'],
      },
      // 自定义间距
      spacing: {
        gutter: '20px',
      },
      // 自定义圆角
      borderRadius: {
        card: '8px',
      },
      // 自定义阴影
      boxShadow: {
        card: '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 112, 243, 0.1)',
      },
    },
  },
  
  plugins: [],
}
```

### 2. postcss.config.js

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. styles/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 在 @layer base 中定义基础样式 */
@layer base {
  html,
  body {
    @apply bg-background text-text;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  a {
    @apply text-primary no-underline hover:underline;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }
}

/* 在 @layer components 中定义组件样式 */
@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-primary text-white rounded-lg font-medium
           hover:bg-blue-700 transition-colors;
  }
  
  .container {
    @apply max-w-5xl mx-auto px-4;
  }
}

/* 在 @layer utilities 中定义工具类 */
@layer utilities {
  .text-truncate {
    @apply truncate;
  }
}
```

## 🎨 使用示例

### 布局组件

```tsx
// components/Layout.tsx
export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
```

### 卡片组件

```tsx
// components/PostCard.tsx
import styles from './PostCard.module.css'

export default function PostCard({ post }) {
  return (
    <article 
      className={`
        ${styles.card}
        bg-white p-6 rounded-card border border-border
        hover:shadow-card-hover transition-all duration-300
      `}
    >
      <h2 className="text-xl font-bold mb-2 text-text">
        {post.title}
      </h2>
      <p className="text-secondary text-sm mb-4">
        {post.date}
      </p>
      <p className="text-text line-clamp-3 mb-4">
        {post.excerpt}
      </p>
      <a 
        href={`/blog/${post.slug}`}
        className="text-primary font-medium hover:underline"
      >
        继续阅读 →
      </a>
    </article>
  )
}
```

```css
/* components/PostCard.module.css */
.card {
  position: relative;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #0070f3, #667eea);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover::before {
  opacity: 1;
}
```

### 响应式布局

```tsx
export default function Page() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {/* 
        - 手机: 1 列
        - 平板 (md: 768px+): 3 列
        - 桌面 (lg: 1024px+): 4 列
      */}
    </div>
  )
}
```

## 🛠️ 常用工具类速查表

### 布局 (Layout)

```css
/* Flexbox */
.flex              /* display: flex */
.flex-col          /* flex-direction: column */
.gap-4             /* gap: 1rem */
.items-center      /* align-items: center */
.justify-between   /* justify-content: space-between */

/* Grid */
.grid              /* display: grid */
.grid-cols-3       /* grid-template-columns: repeat(3, minmax(0, 1fr)) */
.gap-4             /* gap: 1rem */

/* Position */
.absolute          /* position: absolute */
.sticky            /* position: sticky */
.top-0             /* top: 0 */
.z-10              /* z-index: 10 */
```

### 间距 (Spacing)

```css
/* Margin */
.m-4               /* margin: 1rem */
.mx-auto           /* margin-left: auto; margin-right: auto */
.mb-4              /* margin-bottom: 1rem */

/* Padding */
.p-4               /* padding: 1rem */
.px-4              /* padding-left: 1rem; padding-right: 1rem */
.py-2              /* padding-top: 0.5rem; padding-bottom: 0.5rem */
```

### 尺寸 (Sizing)

```css
.w-full            /* width: 100% */
.w-1/2             /* width: 50% */
.h-20              /* height: 5rem */
.min-h-screen      /* min-height: 100vh */
```

### 文本 (Typography)

```css
/* 字体大小 */
.text-sm           /* font-size: 0.875rem */
.text-lg           /* font-size: 1.125rem */
.text-2xl          /* font-size: 1.5rem */

/* 字体样式 */
.font-bold         /* font-weight: 700 */
.font-medium       /* font-weight: 500 */
.italic            /* font-style: italic */

/* 文本对齐 */
.text-center       /* text-align: center */
.text-left         /* text-align: left */

/* 文本颜色 */
.text-primary      /* color: #0070f3 */
.text-gray-600     /* color: rgb(75, 85, 99) */

/* 行截断 */
.truncate          /* white-space: nowrap; overflow: hidden; text-overflow: ellipsis */
.line-clamp-3      /* 最多 3 行 */
```

### 背景 (Background)

```css
.bg-white          /* background-color: white */
.bg-primary        /* background-color: #0070f3 */
.bg-opacity-50     /* background-color: rgba(..., 0.5) */
```

### 边框 (Border)

```css
.border            /* border: 1px solid #d1d5db */
.border-b          /* border-bottom: 1px solid #d1d5db */
.border-gray-200   /* border-color: rgb(229, 231, 235) */
.rounded           /* border-radius: 0.25rem */
.rounded-lg        /* border-radius: 0.5rem */
```

### 阴影 (Shadow)

```css
.shadow-sm         /* box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05) */
.shadow-md         /* box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) */
.shadow-lg         /* box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) */
```

### 动画 (Animation)

```css
.transition        /* transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1) */
.duration-300      /* transition-duration: 300ms */
.hover:bg-blue-600 /* 鼠标悬停时应用样式 */
.focus:ring-2      /* 焦点时添加 ring */
```

### 响应式 (Responsive)

```css
.hidden            /* display: none */
.md:flex           /* 在 md 断点后显示 */
.lg:grid-cols-4    /* 在 lg 断点后 4 列 */
.md:w-1/2          /* 在 md 断点后宽度 50% */
.lg:px-8           /* 在 lg 断点后增加 padding */

/* 断点 */
sm   :   640px
md   :   768px
lg   :   1024px
xl   :   1280px
2xl  :   1536px
```

## 🎯 最佳实践

### ✅ 好的做法

```tsx
// 使用工具类组合
<div className="flex items-center justify-between gap-4 mb-6">
  ...
</div>

// 提取公共类
<button className="btn-primary">
  点击
</button>
```

### ❌ 避免

```tsx
// 过长的 className
<div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center text-lg font-bold text-white bg-black bg-opacity-50">
  ...
</div>

// 改用组件或 CSS Module
```

## 🚀 性能优化

Tailwind CSS 会自动优化未使用的样式：

```bash
# 开发环境：完整的 Tailwind CSS
# 生产环境：自动 PurgeCSS

# 构建输出
npm run build

# 检查 CSS 大小
ls -lh .next/static/css/
```

## 📊 项目结构

```
nextjs-blog/
├── styles/
│   ├── globals.css          # Tailwind 导入 + 全局样式
│   ├── Home.module.css      # 首页 CSS Module
│   ├── Blog.module.css      # 博文 CSS Module
│   └── ...
│
├── components/
│   ├── Header.tsx           # Tailwind + CSS Module
│   ├── Header.module.css
│   ├── Footer.tsx
│   ├── Footer.module.css
│   └── ...
│
├── tailwind.config.js       # Tailwind 配置
├── postcss.config.js        # PostCSS 配置
└── ...
```

## 🔍 调试技巧

### 检查生成的 CSS

```bash
# 查看完整的 Tailwind CSS
cat node_modules/tailwindcss/lib/corePlugins.js

# 检查未使用的类
npm run build -- --analyze
```

### 自定义 VS Code 提示

安装 `Tailwind CSS IntelliSense` 扩展：

```json
// .vscode/settings.json
{
  "tailwindCSS.classAttributes": ["class", "className"],
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## 📚 资源

- [Tailwind CSS 官方文档](https://tailwindcss.com/)
- [Tailwind UI 组件库](https://tailwindui.com/)
- [Tailwind CSS 在线演练场](https://play.tailwindcss.com/)

## 🎓 总结

这个项目结合了 **Tailwind CSS** 和 **CSS Modules** 的优势：

✅ **快速开发** - 使用 Tailwind 的实用类快速样式化
✅ **样式隔离** - CSS Modules 防止样式冲突
✅ **可维护性** - 清晰的关注点分离
✅ **小包体积** - 自动移除未使用的样式
✅ **易于定制** - 自定义主题和配置

---

**开始写样式吧！** 🎨
