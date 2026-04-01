import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import { getAllTags, getPostsByTag, BlogPostPreview } from '@/lib/hexo-reader'
import styles from '@/styles/Blog.module.css'

interface TagPageProps {
  tag: string
  posts: BlogPostPreview[]
}

export default function TagPage({ tag, posts }: TagPageProps) {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>标签: #{tag}</h1>
        
        {posts.length === 0 ? (
          <div className={styles.empty}>该标签下暂无文章</div>
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
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags()

  return {
    paths: tags.map(tag => ({
      params: { tag },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<TagPageProps> = async ({ params }) => {
  const tag = params?.tag as string
  const posts = await getPostsByTag(decodeURIComponent(tag))

  return {
    props: {
      tag: decodeURIComponent(tag),
      posts,
    },
    revalidate: 60,
  }
}
