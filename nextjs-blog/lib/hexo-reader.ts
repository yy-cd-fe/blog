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

const postsDirectory = path.join(process.cwd(), "..", "source", "_posts");

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

    const files = fs
      .readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".md"));

    console.log("[getAllPosts] 找到 Markdown 文件:", files);

    const posts = files.map((file) => {
      console.log("[getAllPosts] 处理文件:", file);
      const fullPath = path.join(postsDirectory, file);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      // 生成摘要（取前 200 个字符）
      const excerpt =
        content
          .replace(/^---[\s\S]*?---\s*/g, "") // 移除 front matter
          .replace(/[#*`[\]()]/g, "") // 移除 markdown 符号
          .substring(0, 200)
          .trim() + "...";

      return {
        slug: file.replace(/\.md$/, ""),
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
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
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
 */
export async function getAllPostSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const files = fs
      .readdirSync(postsDirectory)
      .filter((file) => file.endsWith(".md"));
    return files.map((file) => file.replace(/\.md$/, ""));
  } catch (error) {
    console.error("Error reading post slugs:", error);
    return [];
  }
}
