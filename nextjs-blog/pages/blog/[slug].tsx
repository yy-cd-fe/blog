import { GetStaticProps, GetStaticPaths } from 'next'
import { getPostBySlug, getAllPostSlugs, BlogPost } from '@/lib/hexo-reader'
import Layout from '@/components/Layout'
import styles from '@/styles/post.module.css'

interface BlogPostPageProps {
  post: BlogPost | null
}

export default function BlogPostPage({ post }: BlogPostPageProps) {
  if (!post) {
    return (
      <Layout>
        <div className={styles.error}>文章不存在</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <article className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>{post.date}</span>
            {post.author && <span className={styles.author}>作者: {post.author}</span>}
          </div>
          
          {post.categories.length > 0 && (
            <div className={styles.categories}>
              分类: {post.categories.map((cat, i) => (
                <span key={cat}>
                  {cat}
                  {i < post.categories.length - 1 && ', '}
                </span>
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
              {post.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllPostSlugs()

  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: 'blocking', // 如果路径不存在，返回 404
  }
}

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      post,
    },
    revalidate: 3600, // 每小时重新生成
  }
}
