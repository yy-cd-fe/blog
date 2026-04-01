import { GetStaticProps } from 'next'
import Link from 'next/link'
import { getAllTags, getPostsByTag } from '@/lib/hexo-reader'
import Layout from '@/components/Layout'
import styles from '@/styles/tags.module.css'

interface TagsPageProps {
  tags: Array<{
    name: string
    count: number
  }>
}

export default function TagsPage({ tags }: TagsPageProps) {
  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>标签</h1>
        
        {tags.length === 0 ? (
          <div className={styles.empty}>暂无标签</div>
        ) : (
          <div className={styles.tagCloud}>
            {tags.map(tag => (
              <Link 
                href={`/tags/${encodeURIComponent(tag.name)}`} 
                key={tag.name}
              >
                <span className={styles.tagItem} style={{ fontSize: `${0.8 + Math.min(tag.count * 0.1, 0.6)}rem` }}>
                  {tag.name}
                  <span className={styles.count}>({tag.count})</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<TagsPageProps> = async () => {
  const allTags = await getAllTags()
  
  const tags = await Promise.all(
    allTags.map(async (tag) => ({
      name: tag,
      count: (await getPostsByTag(tag)).length,
    }))
  )

  return {
    props: {
      tags: tags.sort((a, b) => b.count - a.count), // 按数量排序
    },
    revalidate: 60,
  }
}
