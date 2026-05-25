import React from 'react'
import FeatureCard from '../features/FeatureCard'
import styles from '../css/features.module.css'

const features = [
  {
    id: 1,
    title: 'Repetición espaciada inteligente',
    desc: 'El algoritmo optimiza intervalos para máxima retención.',
    icon: '🧠',
  },
  {
    id: 2,
    title: 'Organización automática por cajas',
    desc: 'Tus tarjetas se mueven a cajas según tu rendimiento.',
    icon: '📦',
  },
  {
    id: 3,
    title: 'Seguimiento del progreso',
    desc: 'Panel claro con métricas y streaks diarios.',
    icon: '📈',
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.header}>
        <h2>Características principales</h2>
        <p>Herramientas pensadas para aprender de forma eficiente y enfocada.</p>
      </div>

      <div className={styles.grid}>
        {features.map(f => (
          <FeatureCard key={f.id} icon={f.icon} title={f.title} desc={f.desc} />
        ))}
      </div>
    </section>
  )
}
