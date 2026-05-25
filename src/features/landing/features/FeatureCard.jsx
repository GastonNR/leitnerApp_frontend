import React from 'react'
import styles from '../css/featurecard.module.css'

export default function FeatureCard({ icon, title, desc }) {
  return (
    <article className={styles.card}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </article>
  )
}
