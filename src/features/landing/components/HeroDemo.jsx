import React, { useEffect, useRef, useState } from 'react'
import styles from '../css/heroDemo.module.css'

// Mini demo del método: los mismos intervalos que usa el backend (DIAS_POR_NIVEL).
const DIAS_POR_CAJA = { 1: 1, 2: 3, 3: 7, 4: 14, 5: 30 }

const MAZO_INICIAL = [
  { id: 1, tema: 'Inglés', pregunta: '¿Cómo se dice «olvidar» en inglés?', respuesta: 'To forget', caja: 1 },
  { id: 2, tema: 'Biología', pregunta: '¿Qué orgánulo produce la energía de la célula?', respuesta: 'La mitocondria', caja: 2 },
  { id: 3, tema: 'Historia', pregunta: '¿En qué año llegó el ser humano a la Luna?', respuesta: '1969', caja: 1 },
  { id: 4, tema: 'Química', pregunta: '¿Cuál es el símbolo químico del oro?', respuesta: 'Au', caja: 3 },
  { id: 5, tema: 'Geografía', pregunta: '¿Cuál es el río más largo de América del Sur?', respuesta: 'El Amazonas', caja: 2 },
]

function textoRepaso(caja) {
  const dias = DIAS_POR_CAJA[caja]
  return dias === 1 ? 'repaso mañana' : `repaso en ${dias} días`
}

export default function HeroDemo() {
  const [mazo, setMazo] = useState(MAZO_INICIAL)
  const [indice, setIndice] = useState(0)
  const [volteada, setVolteada] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [ocupada, setOcupada] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const tarjeta = mazo[indice]
  const cantidadPorCaja = [1, 2, 3, 4, 5].map(n => mazo.filter(t => t.caja === n).length)

  const responder = (sabia) => {
    if (!volteada || ocupada) return
    const nuevaCaja = sabia ? Math.min(tarjeta.caja + 1, 5) : 1

    setOcupada(true)
    setMazo(prev => prev.map(t => (t.id === tarjeta.id ? { ...t, caja: nuevaCaja } : t)))
    setResultado({
      sabia,
      caja: nuevaCaja,
      texto: sabia
        ? `¡Bien! Pasa a la caja ${nuevaCaja} · ${textoRepaso(nuevaCaja)}`
        : `Vuelve a la caja 1 · ${textoRepaso(1)}`,
    })

    timer.current = setTimeout(() => {
      setVolteada(false)
      setIndice(i => (i + 1) % mazo.length)
      setOcupada(false)
    }, 1100)
  }

  return (
    <div className={styles.demo}>
      <div className={styles.header}>
        <span className={styles.badge}>Pruébalo</span>
        <span className={styles.counter}>Tarjeta {indice + 1} de {mazo.length}</span>
      </div>

      <div className={styles.stage}>
        <button
          key={tarjeta.id + '-' + indice}
          type="button"
          className={`${styles.card} ${volteada ? styles.flipped : ''}`}
          onClick={() => !ocupada && setVolteada(v => !v)}
          aria-label={volteada ? `Respuesta: ${tarjeta.respuesta}. Toca para ver la pregunta` : `Pregunta: ${tarjeta.pregunta}. Toca para ver la respuesta`}
        >
          <span className={styles.inner}>
            <span className={`${styles.face} ${styles.front}`}>
              <span className={styles.topic}>{tarjeta.tema} · Caja {tarjeta.caja}</span>
              <span className={styles.question}>{tarjeta.pregunta}</span>
              <span className={styles.hint}>Toca la tarjeta para ver la respuesta</span>
            </span>
            <span className={`${styles.face} ${styles.back}`}>
              <span className={styles.topic}>Respuesta</span>
              <span className={styles.answer}>{tarjeta.respuesta}</span>
              <span className={styles.hint}>¿La sabías?</span>
            </span>
          </span>
        </button>
      </div>

      <div className={styles.buttons}>
        <button type="button" className={styles.wrong} onClick={() => responder(false)} disabled={!volteada || ocupada}>
          No lo sabía
        </button>
        <button type="button" className={styles.right} onClick={() => responder(true)} disabled={!volteada || ocupada}>
          Lo sabía
        </button>
      </div>

      <p className={styles.feedback} aria-live="polite">
        {resultado ? (
          <span key={resultado.texto + indice} className={resultado.sabia ? styles.ok : styles.ko}>
            {resultado.texto}
          </span>
        ) : (
          <span className={styles.idle}>Responde y mira cómo se mueve entre cajas</span>
        )}
      </p>

      <ol className={styles.boxes} aria-label="Tarjetas en cada caja">
        {cantidadPorCaja.map((cantidad, i) => {
          const caja = i + 1
          const activa = ocupada && resultado?.caja === caja
          return (
            <li key={caja} className={`${styles.box} ${activa ? styles.boxActive : ''}`} style={{ '--box-color': `var(--l-box-${caja})` }}>
              <span className={styles.boxCount}>{cantidad}</span>
              <span className={styles.boxLabel}>Caja {caja}</span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
