import type { Asignatura, Repaso, Tema } from "../types/context.types"

// Cálculos de la pestaña "Métricas" (tu progreso). Funciones puras.

// Una tarjeta está "aprendida" cuando llegó a la caja 4 o 5
// (se repasa cada 2 semanas o menos).
export function progresoTema(tema: Tema): { total: number, aprendidas: number } {
    const porCaja = [0, 1, 2, 3, 4].map(i => tema.cajas[i]?.tarjetas?.length ?? 0)
    return {
        total: porCaja.reduce((a, b) => a + b, 0),
        aprendidas: porCaja[3] + porCaja[4],
    }
}

// Día local AAAA-MM-DD (igual criterio que "tarjetas para hoy").
const diaLocal = (fecha: Date | string): string => new Date(fecha).toLocaleDateString('sv-SE')

export interface DiaSemana {
    dia: string
    inicial: string     // L, M, X…
    nombre: string      // "lunes 9 de noviembre", para lectores de pantalla
    estudio: boolean
    esHoy: boolean
}

// Los últimos 7 días (hoy al final) y si hubo alguna sesión en cada uno.
export function ultimaSemana(repasos: Repaso[]): DiaSemana[] {
    const conSesion = new Set(repasos.map(r => diaLocal(r.fecha)))
    const hoy = diaLocal(new Date())
    return Array.from({ length: 7 }, (_, i) => {
        const fecha = new Date()
        fecha.setDate(fecha.getDate() - (6 - i))
        const dia = diaLocal(fecha)
        return {
            dia,
            inicial: fecha.toLocaleDateString('es', { weekday: 'narrow' }).toUpperCase(),
            nombre: fecha.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' }),
            estudio: conSesion.has(dia),
            esHoy: dia === hoy,
        }
    })
}

// Días seguidos con al menos una sesión. Si hoy todavía no se estudió,
// la racha no se corta: cuenta desde ayer.
export function racha(repasos: Repaso[]): number {
    const conSesion = new Set(repasos.map(r => diaLocal(r.fecha)))
    const d = new Date()
    if (!conSesion.has(diaLocal(d))) d.setDate(d.getDate() - 1)
    let dias = 0
    while (conSesion.has(diaLocal(d))) {
        dias++
        d.setDate(d.getDate() - 1)
    }
    return dias
}

export interface TemaDestacado {
    tema: Tema
    asignatura: Asignatura
}

const todosLosTemas = (asignaturas: Asignatura[]): TemaDestacado[] =>
    asignaturas.flatMap(asignatura => asignatura.temas.map(tema => ({ tema, asignatura })))

// El tema con más respuestas en los últimos 7 días.
export function masPracticadoSemana(asignaturas: Asignatura[], repasos: Repaso[]): TemaDestacado | null {
    const desde = new Date()
    desde.setHours(0, 0, 0, 0)
    desde.setDate(desde.getDate() - 6)

    const respuestas = new Map<string, number>()
    for (const r of repasos) {
        if (new Date(r.fecha) < desde) continue
        respuestas.set(r.tema, (respuestas.get(r.tema) ?? 0) + r.aciertos + r.fallos)
    }

    let mejor: TemaDestacado | null = null
    let maximo = 0
    for (const t of todosLosTemas(asignaturas)) {
        const n = respuestas.get(t.tema._id) ?? 0
        if (n > maximo) { maximo = n; mejor = t }
    }
    return mejor
}

// El tema con mayor proporción de tarjetas aprendidas (al menos una).
export function masAvanzado(asignaturas: Asignatura[]): TemaDestacado | null {
    let mejor: TemaDestacado | null = null
    let mejorProporcion = 0
    for (const t of todosLosTemas(asignaturas)) {
        const { total, aprendidas } = progresoTema(t.tema)
        const proporcion = total > 0 ? aprendidas / total : 0
        if (aprendidas > 0 && proporcion > mejorProporcion) { mejorProporcion = proporcion; mejor = t }
    }
    return mejor
}
