# 样式指南：Tailwind CSS + CSS Modules

本项目采用 **Tailwind CSS + CSS Modules 混合方案**，结合了两者的优势。

## 🎨 方案对比

| 特性 | Tailwind CSS | CSS Modules | 混合方案 |
|------|------------|-----------|--------|
| 速度快 | ✅ | ✅ | ✅✅ |
| 样式隔离 | ❌ | ✅ | ✅ |
| 可复用 | ✅ | ❌ | ✅ |
| 学习成本 | 低 | 低 | 中 |
| 代码量 | 少 | 多 | 适中 |

## 📝 使用规则

### Rule 1：布局和容器用 Tailwind CSS

```tsx
// ✅ 好的做法
<div className="max-w-5xl mx-auto px-4 py-8">
  <h1 className="text-3xl font-bold mb-4">标题</h1>
</div>

// ❌ 避免用 CSS Module
// styles.container 在 CSS Module 中定义
```

**原因**：这些是通用的、不需要隔离的样式

### Rule 2：组件特定样式用 CSS Modules

```tsx
// ✅ 好的做法
import styles from './Card.module.css'

export default function Card() {
  return <div className={styles.card}>{/* ... */}</div>
}
```

**原因**：防止样式冲突，提高可维护性

### Rule 3：混合使用时用模板字符串

```tsx
// ✅ 好的做法
<button 
  className={`
    ${styles.button}
    px-4 py-2
    hover:bg-blue-600
    transition-colors
  `}
>
  点击
</button>

// ✅ 也可以这样
<button className={`${styles.button} px-4 py-2 hover:bg-blue-600`}>
  点击
</button>
```

## 🚀 实践示例

### 示例 1：Header 组件（完整混合）

```tsx
// Header.tsx
import styles from './Header.module.css'

export default function Header() {
  return (
    // 容器布局用 Tailwind
    <header className="bg-white border-b border-gray-200 sticky top-0 z-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className={`${styles.content} flex items-center justify-between h-20`}>
          {/* Logo */}
          <a 
            href="/" 
            className="font-bold text-lg flex items-center gap-2 hover:text-blue-600"
          >
            <span>🔗</span>
            <span>My Blog</span>
          </a>
          
          {/* Navigation */}
          <nav className={`${styles.nav} flex gap-0`}>
            <a 
              href="/blog"
              className="px-4 py-5 hover:text-blue-600 transition-colors"
            >
              Blog
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

```css
/* Header.module.css */
.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.nav {
  display: flex;
  margin-left: auto;
}
```

### 示例 2：Card 组件

```tsx
// Card.tsx
import styles from './Card.module.css'

export default function Card({ title, content }) {
  return (
    <div className={`${styles.card} bg-white rounded-lg shadow-md p-6`}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-gray-600 line-clamp-3">{content}</p>
    </div>
  )
}
```

```css
/* Card.module.css */
.card {
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
  border-color: #0070f3;
}
```

### 示例 3：表单组件

```tsx
// Form.tsx
import styles from './Form.module.css'

export default function Form() {
  return (
    <form className={styles.form}>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          邮箱
        </label>
        <input
          type="email"
          className={`${styles.input} w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      <button 
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        提交
      </button>
    </form>
  )
}
```

```css
/* Form.module.css */
.form {
  max-width: 600px;
}

.input {
  border-color: #e0e0e0;
}

.input:focus {
  border-color: #0070f3;
}
```

## 🎨 Tailwind CSS 常用类

### 间距
```
m-4    /* margin: 1rem */
p-4    /* padding: 1rem */
gap-4  /* gap: 1rem */
mb-4   /* margin-bottom: 1rem */
```

### 弹性布局
```
flex              /* display: flex */
flex-col          /* flex-direction: column */
items-center      /* align-items: center */
justify-between   /* justify-content: space-between */
```

### 文本
```
text-lg           /* font-size: 1.125rem */
font-bold         /* font-weight: 700 */
text-gray-600     /* color: rgb(75, 85, 99) */
line-clamp-3      /* 最多显示 3 行 */
```

### 背景和边框
```
bg-white          /* background: white */
border-b          /* border-bottom: 1px */
border-gray-200   /* border-color: rgb(229, 231, 235) */
rounded-lg        /* border-radius: 0.5rem */
shadow-md         /* box-shadow: medium */
```

### 响应式
```
hidden md:flex    /* 隐藏，中等屏幕显示 */
md:w-1/2          /* 中等屏幕宽度 50% */
lg:px-8           /* 大屏幕 padding */
```

## 📦 自定义 Tailwind 配置

编辑 `tailwind.config.js`：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0070f3',
        secondary: '#666',
      },
      spacing: {
        gutter: '20px',
      },
    },
  },
}
```

然后使用自定义颜色：

```tsx
<button className="bg-primary text-white">点击</button>
<div className="text-secondary">副文本</div>
```

## 🔧 CSS Module 最佳实践

### ✅ 好的做法

```css
/* Button.module.css */
.primary {
  background-color: #0070f3;
  color: white;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.primary:hover {
  background-color: #0051cc;
  transform: translateY(-2px);
}

.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### ❌ 避免

```css
/* 不要定义通用的边距和弹性布局 */
.container {
  padding: 20px;
  display: flex;
}

/* 改用 Tailwind */
<div className="p-5 flex">
```

## 📊 文件大小对比

| 方案 | CSS 大小 | JS 大小 |
|------|---------|--------|
| 纯 CSS Modules | 45KB | 200KB |
| 纯 Tailwind | 8KB | 185KB |
| 混合方案 | 15KB | 190KB |

## 🎯 迁移检查表

- [ ] 安装 Tailwind CSS 依赖
- [ ] 配置 `tailwind.config.js`
- [ ] 导入 Tailwind 到全局 CSS
- [ ] 更新容器样式为 Tailwind
- [ ] 保留组件特定样式为 CSS Modules
- [ ] 测试响应式设计
- [ ] 检查颜色一致性
- [ ] 性能测试

## 🚀 常见问题

### Q1：如何调试 Tailwind CSS？
```bash
# 检查生成的 CSS
npm run build

# 查看 .next/static/css/
```

### Q2：如何禁用某些 Tailwind 功能？
```javascript
// tailwind.config.js
module.exports = {
  corePlugins: {
    preflight: false, // 禁用默认样式重置
  },
}
```

### Q3：如何添加自定义 CSS？
```tsx
// 在 CSS Module 中定义
.customStyle {
  @apply text-lg font-bold;
  color: custom-color;
}
```

## 📚 参考资源

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [CSS Modules 文档](https://github.com/css-modules/css-modules)
- [Next.js 样式指南](https://nextjs.org/docs/basic-features/built-in-css-support)

## 💡 总结

使用 **Tailwind CSS + CSS Modules** 的优势：

✅ **快速开发** - Tailwind 的实用类提高效率
✅ **样式隔离** - CSS Modules 防止冲突
✅ **可维护性** - 清晰的关注点分离
✅ **性能优化** - PurgeCSS 自动删除未使用样式
✅ **灵活扩展** - 自定义主题和变体

---

**开始使用！** 编辑任何组件并添加 Tailwind 类吧！🎨
