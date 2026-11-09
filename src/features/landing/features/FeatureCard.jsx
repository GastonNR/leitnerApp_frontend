import React from 'react'
import styles from '../css/featurecard.module.css'

export default function FeatureCard({ icon, title, desc, color, delay = 0 }) {
  return (
    <article className={styles.card} data-reveal style={{ '--accent': color, '--reveal-delay': `${delay}s` }}>
      <div className={styles.icon}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.desc}>{desc}</p>
    </article>
  )
}
