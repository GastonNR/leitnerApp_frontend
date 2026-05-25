import React from 'react'
import styles from '../css/how.module.css'

const steps = [
  { id: 1, title: 'Creas tarjetas', desc: 'Añade preguntas y respuestas en segundos.' },
  { id: 2, title: 'Estudias diariamente', desc: 'Sesiones cortas y enfocadas cada día.' },
  { id: 3, title: 'El sistema mueve las tarjetas', desc: 'Las tarjetas avanzan según tu rendimiento.' },
]

export default function HowItWorksSection() {
  return (
    <section id="how" className={styles.how}>
      <h2>Cómo funciona</h2>
      <div className={styles.steps}>
        {steps.map(s => (
          <div key={s.id} className={styles.step}>
            <div className={styles.index}>{s.id}</div>
            <div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
