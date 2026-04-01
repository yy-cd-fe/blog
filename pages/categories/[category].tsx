import { GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import { getAllCategories, getPostsByCategory, BlogPostPreview } from '@/lib/hexo-reader'
import styles from '@/styles/Blog.module.css'

interface CategoryPageProps {
  category: string
  posts: BlogPostPreview[]
}

export default function CategoryPage({ category, posts }: CategoryPageProps) {
  return (
    <div className={styles.container}>
        <h1 className={styles.title}>分类: {category}</h1>
        
        {posts.length === 0 ? (
          <div className={styles.empty}>该分类下暂无文章</div>
        ) : (
          <div className={styles.postList}>
            {posts.map(post => (
              <Link href={`/blog/${post.slug}`} key={post.slug}>
                <article className={styles.postItem}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <div className={styles.postMeta}>
                    <span className={styles.date}>{post.date}</span>
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

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await getAllCategories()

  return {
    paths: categories.map(category => ({
      params: { category },
    })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<CategoryPageProps> = async ({ params }) => {
  const category = params?.category as string
  const posts = await getPostsByCategory(decodeURIComponent(category))

  return {
    props: {
      category: decodeURIComponent(category),
      posts,
    },
    revalidate: 60,
  }
}
