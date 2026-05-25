import React from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../css/layout.module.css'

export default function LandingLayout({ children }) {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.container}>{children}</div>
      <Footer />
    </div>
  )
}
