import { GetStaticProps, GetStaticPaths } from "next";
import { useRouter } from "next/router";
import {
  getPostBySlug,
  getAllPostSlugs,
  getAllPosts,
  BlogPost,
  BlogPostPreview,
} from "@/lib/hexo-reader";
import Link from "next/link";
import styles from "@/styles/post.module.css";

interface BlogPostPageProps {
  post: BlogPost | null;
  readingTime: number;
  prevPost: BlogPostPreview | null;
  nextPost: BlogPostPreview | null;
}

// 计算阅读时间（按平均每分钟 300 字计算）
function calculateReadingTime(content: string): number {
  const wordCount = content.length;
  const readingTime = Math.ceil(wordCount / 300);
  return Math.max(1, readingTime);
}

// 获取相邻的文章
async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === currentSlug);

  return {
    prevPost: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    nextPost:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

export default function BlogPostPage({
  post,
  readingTime,
  prevPost,
  nextPost,
}: BlogPostPageProps) {
  const router = useRouter();
  
  if (router.isFallback) {
    return <div className={styles.error}>加载中...</div>;
  }
  
  if (!post) {
    return <div className={styles.error}>文章不存在</div>;
  }

  return (
    <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>📅 {post.date}</span>
            {post.author && (
              <span className={styles.author}>✍️ 作者: {post.author}</span>
            )}
            <span className={styles.readingTime}>
              ⏱️ 阅读时间: {readingTime} 分钟
            </span>
          </div>

          {post.categories.length > 0 && (
            <div className={styles.categories}>
              📂 分类:{" "}
              {post.categories.map((cat, i) => (
                <Link href={`/categories/${encodeURIComponent(cat)}`} key={cat}>
                  <span className={styles.categoryLink}>
                    {cat}
                    {i < post.categories.length - 1 && ", "}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </header>

        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        {post.tags.length > 0 && (
          <footer className={styles.footer}>
            <div className={styles.tags}>
              {post.tags.map((tag) => (
                <Link href={`/tags/${encodeURIComponent(tag)}`} key={tag}>
                  <span className={styles.tag}>#{tag}</span>
                </Link>
              ))}
            </div>
          </footer>
        )}

        {/* 文章导航 */}
        <div className={styles.navigation}>
          {prevPost && (
            <Link href={`/blog/${prevPost.slug}`} className={styles.navLink}>
              <div className={styles.navItem}>
                <span className={styles.navLabel}>← 上一篇</span>
                <span className={styles.navTitle}>{prevPost.title}</span>
              </div>
            </Link>
          )}
          {nextPost && (
            <Link href={`/blog/${nextPost.slug}`} className={styles.navLink}>
              <div className={styles.navItem}>
                <span className={styles.navLabel}>下一篇 →</span>
                <span className={styles.navTitle}>{nextPost.title}</span>
              </div>
            </Link>
          )}
        </div>

        {/* 评论区占位 */}
        <section className={styles.comments}>
          <div className={styles.commentsPlaceholder}>💬 评论功能开发中...</div>
        </section>
      </article>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs();
  console.log('[getStaticPaths] 获取到的所有 slugs:', slugs);

  return {
    paths: slugs.map((slug) => {
      // 处理包含斜杠的 slug，转换为数组形式
      const slugArray = slug.split('/');
      return { params: { slug: slugArray } };
    }),
    fallback: 'blocking', // 如果路径不存在，则在服务器上生成，然后缓存
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  // 处理数组形式的 slug
  const slugArray = params?.slug as string[];
  const slug = Array.isArray(slugArray) ? slugArray.join('/') : slugArray;
  
  console.log('[getStaticProps] slug array:', slugArray);
  console.log('[getStaticProps] slug string:', slug);
  
  const post = await getPostBySlug(slug);
  console.log('[getStaticProps] post:', post);

  if (!post) {
    return {
      notFound: true,
    };
  }

  // 计算阅读时间
  const readingTime = calculateReadingTime(post.content);

  // 获取相邻的文章
  const { prevPost, nextPost } = await getAdjacentPosts(slug);

  return {
    props: {
      post,
      readingTime,
      prevPost,
      nextPost,
    },
    revalidate: 3600, // 每小时重新生成
  };
};
