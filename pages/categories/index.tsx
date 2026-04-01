import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getAllCategories, getPostsByCategory } from '@/lib/hexo-reader'
import Layout from '@/components/Layout'
import styles from '@/styles/categories.module.css'

interface CategoriesPageProps {
  categories: Array<{
    name: string
    count: number
  }>
}

export default function CategoriesPage({ categories }: CategoriesPageProps) {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>分类</h1>
        
        {categories.length === 0 ? (
          <div className={styles.empty}>暂无分类</div>
        ) : (
          <div className={styles.categoryGrid}>
            {categories.map(category => (
              <Link 
                href={`/categories/${encodeURIComponent(category.name)}`} 
                key={category.name}
              >
                <div className={styles.categoryCard}>
                  <h2 className={styles.categoryName}>{category.name}</h2>
                  <span className={styles.count}>{category.count} 篇文章</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<CategoriesPageProps> = async () => {
  const allCategories = await getAllCategories()
  
  const categories = await Promise.all(
    allCategories.map(async (cat) => ({
      name: cat,
      count: (await getPostsByCategory(cat)).length,
    }))
  )

  return {
    props: {
      categories,
    },
    revalidate: 60,
  }
}
