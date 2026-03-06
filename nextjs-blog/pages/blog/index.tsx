import Link from 'next/link'
import styles from '../../styles/Blog.module.css'

interface Post {
  title: string
  date: string
  excerpt: string
  slug: string
  categories?: string[]
  tags?: string[]
}

export default function BlogList({ posts }: { posts: Post[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>所有文章</h1>
        <p>共 {posts.length} 篇文章</p>
      </div>

      <div className={styles.layout}>
        {/* 主要内容 */}
        <main className={styles.main}>
          {posts.length > 0 ? (
            <div className={styles.postList}>
              {posts.map((post) => (
                <article key={post.slug} className={styles.postItem}>
                  <div className={styles.postHeader}>
                    <Link href={`/blog/${post.slug}`}>
                      <h2>{post.title}</h2>
                    </Link>
                    <div className={styles.postMeta}>
                      <span className={styles.date}>{post.date}</span>
                      {post.categories && post.categories.length > 0 && (
                        <span className={styles.categories}>
                          {post.categories.map((cat) => (
                            <Link key={cat} href={`/categories/${cat}`} className={styles.category}>
                              {cat}
                            </Link>
                          ))}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.tags}>
                      {post.tags.map((tag) => (
                        <Link key={tag} href={`/tags/${tag}`} className={styles.tag}>
                          #{tag}
                        </Link>
                      ))}
                    </div>
                  )}
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    继续阅读 →
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>暂无文章</p>
            </div>
          )}
        </main>

        {/* 侧边栏 */}
        <aside className={styles.sidebar}>
          <div className={styles.widget}>
            <h3>文章统计</h3>
            <p>共有 <strong>{posts.length}</strong> 篇文章</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  // 暂时返回空数组
  const posts: Post[] = []

  return {
    props: { posts },
    revalidate: 3600,
  }
}
