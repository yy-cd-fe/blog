import { GetStaticProps } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { getAllPosts, BlogPostPreview } from '@/lib/hexo-reader'

export default function Home({ posts }: { posts: BlogPostPreview[] }) {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1>欢迎来到我的博客</h1>
        <p>分享技术、记录生活、探索前沿开发技术</p>
      </div>

      <section className={styles.posts}>
        <h2>最新文章</h2>
        <div className={styles.postList}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <article key={post.slug} className={styles.postCard}>
                <Link href={`/blog/${post.slug}`}>
                  <h3>{post.title}</h3>
                </Link>
                <p className={styles.meta}>{post.date}</p>
                <p className={styles.excerpt}>{post.excerpt}</p>
                <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                  继续阅读 →
                </Link>
              </article>
            ))
          ) : (
            <p>暂无文章</p>
          )}
        </div>
      </section>

      <section className={styles.features}>
        <h2>特色功能</h2>
        <div className={styles.featureGrid}>
          <div className={styles.feature}>
            <h4>📝 技术文章</h4>
            <p>分享前端开发的最佳实践和技术心得</p>
          </div>
          <div className={styles.feature}>
            <h4>🏷️ 分类标签</h4>
            <p>通过分类和标签快速查找感兴趣的内容</p>
          </div>
          <div className={styles.feature}>
            <h4>⚡ 高性能</h4>
            <p>基于 Next.js 和 Hexo 的高性能博客系统</p>
          </div>
          <div className={styles.feature}>
            <h4>🎨 响应式设计</h4>
            <p>完美适配各种设备，提供最佳阅读体验</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPosts()
  // 只显示最新的 5 篇文章
  const posts = allPosts.slice(0, 5)

  return {
    props: { posts },
    revalidate: 60, // 每 60 秒重新生成
  }
}
