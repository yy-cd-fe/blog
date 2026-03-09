# 📋 部署前检查清单

## 🚀 部署前必检项

### ✅ 代码检查
- [ ] 所有文件已保存
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 警告
- [ ] 没有 console.log 调试信息
- [ ] 没有 TODO 注释

**验证命令**：
```bash
npm run lint
npm run build
```

### ✅ 内容检查
- [ ] 所有 Markdown 文件有正确的 Front Matter
- [ ] 文章日期格式正确（YYYY-MM-DD）
- [ ] 所有链接都有效
- [ ] 图片已上传到正确位置
- [ ] 没有草稿文件在发布目录

**检查方法**：
```bash
# 查看所有文章
ls source/_posts/*.md

# 验证文章能否正确生成
npm run build
```

### ✅ 配置检查
- [ ] `package.json` 配置正确
- [ ] `tsconfig.json` 配置正确
- [ ] `next.config.js` 配置正确
- [ ] `tailwind.config.js` 配置正确
- [ ] 环境变量已设置

**检查方法**：
```bash
# 查看配置
cat package.json | grep -E '"name"|"version"|"scripts"'
```

### ✅ 构建检查
- [ ] 本地构建成功
- [ ] 构建输出目录正确
- [ ] 静态文件已生成
- [ ] 没有构建警告

**验证命令**：
```bash
npm run build
# 应该看到绿色的✓符号和文件列表
```

### ✅ 本地测试
- [ ] 本地开发服务器运行正常
- [ ] 所有页面可访问
- [ ] 所有文章正常显示
- [ ] 分类和标签功能正常
- [ ] 响应式设计工作正常

**测试方法**：
```bash
npm run dev
# 访问 http://localhost:3000
# 测试所有页面
```

---

## 🌐 部署目标选择

### 选项 1️⃣：Vercel（推荐 ⭐）

**优点**：
- 零配置
- 自动 CI/CD
- 全球 CDN
- 免费额度充足

**部署步骤**：

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 部署到生产环境
vercel --prod
```

**部署前准备**：
- [ ] 项目已推送到 GitHub
- [ ] GitHub 账号已连接到 Vercel
- [ ] 环境变量已配置（如有需要）

**验证部署**：
- [ ] Vercel 显示"Ready"状态
- [ ] 网站可在提供的 URL 访问
- [ ] 所有页面加载正常

---

### 选项 2️⃣：GitHub Pages

**优点**：
- 完全免费
- 与 GitHub 集成
- 支持自定义域名

**部署步骤**：

```bash
# 1. 构建项目
npm run build

# 2. 创建 .nojekyll 文件防止 Jekyll 处理
touch .nojekyll

# 3. 部署到 gh-pages 分支
git add .nojekyll
git commit -m "Add .nojekyll for GitHub Pages"
git push origin master
git subtree push --prefix .next/standalone origin gh-pages
```

**配置 GitHub**：
- [ ] 项目设置 → Pages
- [ ] Source 设置为 `gh-pages` 分支
- [ ] 保存并等待部署

**部署前准备**：
- [ ] 项目已推送到 GitHub
- [ ] GitHub Actions 已启用
- [ ] 仓库设置为公开（或支持私有）

---

### 选项 3️⃣：其他静态托管服务

**支持的服务**：
- Netlify
- Cloudflare Pages
- AWS Amplify
- Firebase Hosting

**通用部署步骤**：

```bash
# 1. 构建项目
npm run build

# 2. 部署 .next 目录
# 根据服务商提供的部署命令
```

---

## 📊 部署前性能检查

### 构建大小检查

```bash
npm run build

# 查看输出的文件大小
ls -lh .next/standalone
```

**预期大小**：
- JavaScript: < 100 KB
- CSS: < 50 KB
- HTML: < 200 KB (首页)

### 页面加载检查

```bash
# 启动生产服务器
npm run start

# 在浏览器中打开开发者工具
# 查看 Network 选项卡中的加载时间
```

**预期时间**：
- 首屏加载: < 1 秒
- 完全交互: < 2 秒
- 最大内容绘制 (LCP): < 2.5 秒

---

## 🔐 安全检查

- [ ] 没有敏感信息在代码中
- [ ] 没有 API 密钥暴露
- [ ] HTTPS 已启用
- [ ] 没有跨域问题
- [ ] 没有安全漏洞

**检查方法**：

```bash
# 搜索可能的敏感信息
grep -r "password\|api_key\|secret" .

# 检查依赖包漏洞
npm audit

# 修复可修复的漏洞
npm audit fix
```

---

## 🌍 域名和 SSL 配置

### 如果使用自定义域名

- [ ] 域名已购买
- [ ] DNS 记录已配置
- [ ] 指向正确的部署地址
- [ ] SSL 证书已配置
- [ ] 自动续期已设置

**配置方式**（根据服务商而异）：

**Vercel**：
1. 项目设置 → Domains
2. 添加自定义域名
3. 配置 DNS 记录
4. SSL 自动配置

**GitHub Pages**：
1. 项目设置 → Pages
2. Custom domain 输入域名
3. 配置 DNS A 记录
4. 启用 "Enforce HTTPS"

---

## 📢 发布后检查

### 部署验证

部署完成后：

- [ ] 访问网站 URL
- [ ] 首页正常显示
- [ ] 点击导航链接工作正常
- [ ] 文章链接正确
- [ ] 分类和标签功能工作
- [ ] 移动设备显示正常

### SEO 验证

- [ ] 页面标题正确
- [ ] Meta 描述已设置
- [ ] Open Graph 标签正确
- [ ] Robots.txt 配置（如需要）
- [ ] Sitemap.xml 可访问

**检查方法**：

```bash
# 查看页面源代码
curl https://your-domain.com | head -50

# 检查是否有 meta 标签
curl https://your-domain.com | grep -i meta
```

### 性能验证

使用 Google 灯塔检查性能：

1. 访问 [PageSpeed Insights](https://pagespeed.web.dev/)
2. 输入网站 URL
3. 检查以下指标：
   - Performance (目标: > 90)
   - Accessibility (目标: > 90)
   - Best Practices (目标: > 90)
   - SEO (目标: > 90)

### 功能验证

在生产环境中测试：

- [ ] 首页加载时间 < 1s
- [ ] 文章加载时间 < 1.5s
- [ ] 分类页面加载时间 < 1s
- [ ] 标签页面加载时间 < 1s
- [ ] 在慢网络下工作（使用浏览器限流工具测试）

---

## 📝 部署记录

### 部署信息模板

```
部署日期：YYYY-MM-DD
部署时间：HH:MM:SS
部署环境：[Vercel / GitHub Pages / 其他]
部署分支：[branch-name]
版本号：v1.0.0
部署链接：https://...
部署时长：XX 分钟

验证状态：
□ 构建成功
□ 所有页面可访问
□ 性能满足预期
□ 功能正常
□ SEO 配置正确

问题和备注：
[记录任何问题或注意事项]
```

---

## 🚨 常见问题排查

### 部署失败

**问题**：Vercel/GitHub Pages 构建失败

**检查步骤**：
1. 查看构建日志找出错误信息
2. 运行 `npm run build` 本地重现
3. 查看 TypeScript 错误：`npm run build`
4. 查看 linting 错误：`npm run lint`

### 页面显示 404

**问题**：部署后某些页面返回 404

**原因和解决**：
- [ ] 文章文件不存在 → 检查 `source/_posts/`
- [ ] 路由配置错误 → 检查 `pages/` 目录
- [ ] 构建时跳过了某些路由 → 检查 `getStaticPaths`

### 性能慢

**问题**：页面加载缓慢

**检查步骤**：
1. 检查 Network 选项卡中的加载时间
2. 查看是否有大的图片文件
3. 查看是否有外部资源阻塞
4. 启用 Next.js 分析：`ANALYZE=true npm run build`

### 样式丢失

**问题**：部署后样式未显示

**原因和解决**：
- [ ] CSS 文件未加载 → 检查 public 目录
- [ ] 路径别名配置错误 → 检查 `tsconfig.json`
- [ ] Tailwind 配置错误 → 检查 `tailwind.config.js`

---

## ✅ 最终检查清单

部署前最后确认：

```
代码质量：
  ☐ npm run lint 无错误
  ☐ npm run build 成功
  ☐ npm run dev 正常运行

内容检查：
  ☐ 所有文章有正确的 Front Matter
  ☐ 没有草稿文件在发布目录
  ☐ 所有链接都有效

配置检查：
  ☐ 环境变量已设置
  ☐ 部署配置正确
  ☐ 域名配置就绪

最后测试：
  ☐ 本地构建和运行测试完成
  ☐ 所有页面功能测试完成
  ☐ 响应式设计测试完成

部署准备：
  ☐ 代码已提交到 Git
  ☐ 选定部署服务
  ☐ 部署命令已记录
```

---

## 🎉 部署完成！

部署成功后：

1. ✅ 分享你的博客链接
2. ✅ 提交到搜索引擎
3. ✅ 监控性能指标
4. ✅ 定期更新内容
5. ✅ 收集用户反馈

---

**祝部署顺利！** 🚀

有任何问题，请参考其他文档或寻求社区帮助。
