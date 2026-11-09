import React, { useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import useReveal from '../hooks/useReveal'
import styles from '../css/layout.module.css'

export default function LandingLayout({ children }) {
  const pageRef = useRef(null)
  useReveal(pageRef)

  return (
    <div className={styles.page} ref={pageRef}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  )
}
