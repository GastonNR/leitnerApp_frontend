import React from 'react'
import FeatureCard from '../features/FeatureCard'
import styles from '../css/features.module.css'

const icono = path => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
  </svg>
)

const features = [
  {
    id: 'hoy',
    title: 'Solo lo que toca hoy',
    desc: 'Cada día ves únicamente las tarjetas que vencen. Nada de repasar lo que ya dominas.',
    color: '#facc15',
    icon: icono(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>),
  },
  {
    id: 'recuerdo',
    title: 'Recuerdo activo',
    desc: 'Intentas responder de memoria y recién después volteas la tarjeta. Así el recuerdo se fija mejor.',
    color: '#22d3ee',
    icon: icono(<><rect x="3" y="6" width="14" height="12" rx="2" /><path d="M7 3h12a2 2 0 0 1 2 2v10" /></>),
  },
  {
    id: 'lecciones',
    title: 'Una lección por tema',
    desc: 'Inglés, Biología, Historia… cada lección tiene sus propias 5 cajas y avanza a su ritmo.',
    color: '#fb923c',
    icon: icono(<><path d="M4 19V6a2 2 0 0 1 2-2h12v15H6a2 2 0 0 0-2 2" /><path d="M8 8h6M8 12h4" /></>),
  },
  {
    id: 'calendario',
    title: 'Calendario de repaso',
    desc: 'Un calendario te muestra qué cajas conviene repasar cada día para no perder el ritmo.',
    color: '#34d399',
    icon: icono(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>),
  },
]

export default function FeaturesSection() {
  return (
    <section id="funciones" className={styles.features}>
      <div className="l-container">
        <div className="l-section-head" data-reveal>
          <span className="l-eyebrow">Funciones</span>
          <h2>Todo lo necesario para estudiar, nada que te distraiga</h2>
          <p>Una herramienta simple y enfocada: tú pones las tarjetas, LeitnerApp decide cuándo repasarlas.</p>
        </div>

        <div className={styles.grid}>
          {features.map((f, i) => (
            <FeatureCard key={f.id} icon={f.icon} title={f.title} desc={f.desc} color={f.color} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  )
}
