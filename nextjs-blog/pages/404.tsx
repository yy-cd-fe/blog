import Link from 'next/link'
import styles from '../styles/Error.module.css'

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>404</h1>
        <p>页面未找到</p>
        <Link href="/" className={styles.button}>
          返回首页
        </Link>
      </div>
    </div>
  )
}
