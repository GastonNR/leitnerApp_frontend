import React from 'react'
import styles from '../css/method.module.css'

const CAJAS = [
  { caja: 1, intervalo: '1 día', altura: 34 },
  { caja: 2, intervalo: '3 días', altura: 50 },
  { caja: 3, intervalo: '7 días', altura: 66 },
  { caja: 4, intervalo: '14 días', altura: 83 },
  { caja: 5, intervalo: '30 días', altura: 100 },
]

/* Curva del olvido (ilustrativa): sin repasos el recuerdo cae rápido;
   con repasos en los días 1, 4, 11 y 25 (intervalos 1·3·7·14) cada caída es más lenta. */
const ANCHO = 520
const ALTO = 220
const DIAS = 30
const x = d => 40 + (d / DIAS) * (ANCHO - 60)
const y = r => 16 + (1 - r) * (ALTO - 48)

function tramo(desde, hasta, estabilidad) {
  const puntos = []
  for (let d = desde; d <= hasta + 0.001; d += 0.25) {
    puntos.push(`${x(d).toFixed(1)},${y(Math.exp(-(d - desde) / estabilidad)).toFixed(1)}`)
  }
  return puntos
}

const SIN_REPASO = 'M' + tramo(0, DIAS, 1.6).join(' L')

const REPASOS = [0, 1, 4, 11, 25]
const ESTABILIDAD = [1.6, 4, 10, 24, 60]
// Un solo trazo continuo: cada repaso sube el recuerdo de nuevo al 100%.
const CON_REPASO = 'M' + REPASOS.flatMap((inicio, i) => {
  const fin = REPASOS[i + 1] ?? DIAS
  return tramo(inicio, fin, ESTABILIDAD[i])
}).join(' L')

export default function MethodSection() {
  return (
    <section id="metodo" className={styles.method}>
      <div className="l-container">
        <div className="l-section-head" data-reveal>
          <span className="l-eyebrow">El método Leitner</span>
          <h2>Cinco cajas. Un método que funciona desde 1972.</h2>
          <p>
            Sebastian Leitner propuso ordenar las tarjetas en cajas según cuánto las dominas.
            Las que te cuestan aparecen seguido; las que ya sabes, cada vez menos.
          </p>
        </div>

        <div className={styles.grid}>
          <article className={styles.panel} data-reveal>
            <h3>Cada acierto sube una caja</h3>
            <p className={styles.panelText}>
              Cuanto más alta la caja, más tiempo pasa hasta el próximo repaso.
            </p>

            <ol className={styles.stairs} aria-label="Intervalo de repaso de cada caja">
              {CAJAS.map(c => (
                <li key={c.caja} className={styles.step} style={{ '--h': `${c.altura}%`, '--box-color': `var(--l-box-${c.caja})` }}>
                  <span className={styles.interval}>{c.intervalo}</span>
                  <span className={styles.bar}>
                    <span className={styles.barNumber}>{c.caja}</span>
                  </span>
                  <span className={styles.label}>Caja {c.caja}</span>
                </li>
              ))}
            </ol>

            <div className={styles.legend}>
              <span className={styles.up}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Aciertas: sube a la caja siguiente
              </span>
              <span className={styles.down}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 12H6M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Fallas: vuelve a la caja 1
              </span>
            </div>
          </article>

          <article className={styles.panel} data-reveal style={{ '--reveal-delay': '0.12s' }}>
            <h3>Repasar justo antes de olvidar</h3>
            <p className={styles.panelText}>
              Sin repasar, olvidamos buena parte de lo aprendido en pocos días. Cada repaso en el
              momento justo refuerza el recuerdo y hace que dure más; por eso los intervalos se alargan.
            </p>

            <figure className={styles.chart}>
              <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Gráfico ilustrativo: sin repasos el recuerdo cae rápido; con repasos espaciados se mantiene alto">
                <defs>
                  <linearGradient id="curvaRepaso" x1="0" x2="1">
                    <stop offset="0" stopColor="#2563eb" />
                    <stop offset="1" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                {[0, 0.5, 1].map(r => (
                  <line key={r} x1={x(0)} x2={x(DIAS)} y1={y(r)} y2={y(r)} className={styles.gridLine} />
                ))}
                <text x={x(0) - 8} y={y(1) + 4} className={styles.axisText} textAnchor="end">100%</text>
                <text x={x(0) - 8} y={y(0) + 4} className={styles.axisText} textAnchor="end">0%</text>
                <text x={x(0)} y={ALTO - 6} className={styles.axisText}>Hoy</text>
                <text x={x(DIAS)} y={ALTO - 6} className={styles.axisText} textAnchor="end">30 días</text>

                <path d={SIN_REPASO} className={styles.forget} />
                <path d={CON_REPASO} className={styles.remember} stroke="url(#curvaRepaso)" />
                {REPASOS.slice(1).map(d => (
                  <circle key={d} cx={x(d)} cy={y(1)} r="5" className={styles.reviewDot} />
                ))}
              </svg>
              <figcaption className={styles.caption}>
                <span><i className={styles.keyRemember} /> Con repasos espaciados</span>
                <span><i className={styles.keyForget} /> Sin repasar</span>
                <span className={styles.note}>Gráfico ilustrativo</span>
              </figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>
  )
}
