import type { Tarjeta } from "../types/context.types"

// Fecha local en formato AAAA-MM-DD, para comparar solo el día (igual que LeccionesContext)
const dia = (fecha: Date | string): string => new Date(fecha).toLocaleDateString('sv-SE')

/** true si la tarjeta toca hoy o ya venció */
export function venceHoy(tarjeta: Pick<Tarjeta, 'proxima_revision'>): boolean {
    if (!tarjeta.proxima_revision) return false
    return dia(tarjeta.proxima_revision) <= dia(new Date())
}
