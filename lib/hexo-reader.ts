import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  html: string;
  tags: string[];
  categories: string[];
  author?: string;
}

export interface BlogPostPreview {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  categories: string[];
}

const postsDirectory = path.join(process.cwd(), "posts");

/**
 * 递归获取所有 Markdown 文件
 */
function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // 递归读取子目录
        files.push(...getAllMarkdownFiles(fullPath));
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        files.push(fullPath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error);
  }
  
  return files;
}

/**
 * 获取所有文章列表（用于首页和列表页）
 */
export async function getAllPosts(): Promise<BlogPostPreview[]> {
  try {
    console.log("[getAllPosts] 开始读取文章，目录:", postsDirectory);

    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory not found: ${postsDirectory}`);
      return [];
    }

    console.log("[getAllPosts] 目录存在，开始读取文件");

    // 获取所有 markdown 文件（包括子目录）
    const files = getAllMarkdownFiles(postsDirectory);

    console.log("[getAllPosts] 找到 Markdown 文件:", files);

    const posts = files.map((fullPath) => {
      console.log("[getAllPosts] 处理文件:", fullPath);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      
      // 从路径生成 slug：如果是子目录中的文件，使用 "目录名/文件名" 的形式
      const relativePath = path.relative(postsDirectory, fullPath);
      const slug = relativePath.replace(/\.md$/, "").replace(/\\/g, "/");

      // 生成摘要（取前 200 个字符）
      const excerpt =
        content
          .replace(/^---[\s\S]*?---\s*/g, "") // 移除 front matter
          .replace(/[#*`[\]()]/g, "") // 移除 markdown 符号
          .substring(0, 200)
          .trim() + "...";

      return {
        slug,
        title: data.title || "无标题",
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        excerpt,
        tags: data.tags || [],
        categories: data.categories || [],
      };
    });

    // 按日期排序（最新的在前）
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

/**
 * 获取单篇文章（包含 HTML 内容）
 * 支持子目录中的文章，slug 格式为 "目录名/文件名"
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    // 将 slug 转换为文件路径（支持 Windows 和 Unix 路径）
    const filePath = slug.replace(/\//g, path.sep);
    const fullPath = path.join(postsDirectory, `${filePath}.md`);

    console.log(`[getPostBySlug] 查找文章: ${slug}`);
    console.log(`[getPostBySlug] 完整路径: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
      console.warn(`[getPostBySlug] 文章不存在: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // 将 Markdown 转换为 HTML
    const processedContent = await remark().use(remarkHtml).process(content);
    const html = processedContent.toString();

    // 生成摘要
    const excerpt =
      content
        .replace(/[#*`[\]()]/g, "")
        .substring(0, 200)
        .trim() + "...";

    return {
      slug,
      title: data.title || "无标题",
      date: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      excerpt,
      content,
      html,
      tags: data.tags || [],
      categories: data.categories || [],
      author: data.author || "匿名",
    };
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * 获取所有分类
 */
export async function getAllCategories(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const categories = new Set<string>();

    posts.forEach((post) => {
      post.categories.forEach((cat) => categories.add(cat));
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error("Error reading categories:", error);
    return [];
  }
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const tags = new Set<string>();

    posts.forEach((post) => {
      post.tags.forEach((tag) => tags.add(tag));
    });

    return Array.from(tags).sort();
  } catch (error) {
    console.error("Error reading tags:", error);
    return [];
  }
}

/**
 * 按分类获取文章
 */
export async function getPostsByCategory(
  category: string,
): Promise<BlogPostPreview[]> {
  try {
    const posts = await getAllPosts();
    return posts.filter((post) => post.categories.includes(category));
  } catch (error) {
    console.error(`Error reading posts by category ${category}:`, error);
    return [];
  }
}

/**
 * 按标签获取文章
 */
export async function getPostsByTag(tag: string): Promise<BlogPostPreview[]> {
  try {
    const posts = await getAllPosts();
    return posts.filter((post) => post.tags.includes(tag));
  } catch (error) {
    console.error(`Error reading posts by tag ${tag}:`, error);
    return [];
  }
}

/**
 * 获取所有可用的动态路由参数（用于 getStaticPaths）
 * 支持子目录中的文章
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const files = getAllMarkdownFiles(postsDirectory);
    return files.map((fullPath) => {
      const relativePath = path.relative(postsDirectory, fullPath);
      return relativePath.replace(/\.md$/, "").replace(/\\/g, "/");
    });
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}
