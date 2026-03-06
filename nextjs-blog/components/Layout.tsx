import React from 'react'
import Header from './Header'
import Footer from './Footer'
import styles from './Layout.module.css'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <div className="container">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
