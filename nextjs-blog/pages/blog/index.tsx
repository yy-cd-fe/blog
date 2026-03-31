import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getAllPosts, BlogPostPreview } from '@/lib/hexo-reader'
import styles from '@/styles/blog.module.css'

interface BlogPageProps {
  posts: BlogPostPreview[]
}

export default function BlogPage({ posts }: BlogPageProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>文章列表</h1>
      
      {posts.length === 0 ? (
        <div className={styles.empty}>暂无文章</div>
      ) : (
        <div className={styles.postList}>
          {posts.map(post => (
            <Link href={`/blog/${post.slug}`} key={post.slug}>
              <article className={styles.postItem}>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <div className={styles.postMeta}>
                  <span className={styles.date}>{post.date}</span>
                  {post.categories.length > 0 && (
                    <div className={styles.categories}>
                      {post.categories.map(cat => (
                        <span key={cat} className={styles.category}>
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className={styles.excerpt}>{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className={styles.tags}>
                    {post.tags.map(tag => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps<BlogPageProps> = async () => {
  const posts = await getAllPosts()

  return {
    props: {
      posts,
    },
    revalidate: 60, // 每 60 秒重新生成
  }
}
