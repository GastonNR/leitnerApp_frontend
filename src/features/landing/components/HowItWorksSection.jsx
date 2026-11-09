import React from 'react'
import styles from '../css/how.module.css'

const steps = [
  {
    id: 1,
    title: 'Crea asignaturas y temas',
    desc: 'Una asignatura por materia o idioma, dividida en los temas que estés estudiando.',
  },
  {
    id: 2,
    title: 'Añade tus tarjetas',
    desc: 'Escribe una pregunta y su respuesta. Mejor cortas, con una sola idea cada una.',
  },
  {
    id: 3,
    title: 'Estudia unos minutos al día',
    desc: 'Responde las tarjetas de hoy y LeitnerApp las mueve de caja y agenda el próximo repaso.',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className={styles.how}>
      <div className="l-container">
        <div className="l-section-head" data-reveal>
          <span className="l-eyebrow">Cómo empezar</span>
          <h2>De cero a estudiar en tres pasos</h2>
          <p>Sin configuraciones ni curvas de aprendizaje. Creas tus tarjetas y el método hace el resto.</p>
        </div>

        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.id} className={styles.step} data-reveal style={{ '--reveal-delay': `${i * 0.12}s` }}>
              <span className={styles.index} aria-hidden="true">{s.id}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
