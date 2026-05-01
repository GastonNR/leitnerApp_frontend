import { useState } from "react";
import { useCajas } from "../context/cajasContext";
import "../css/leccionesModal.css";

export default function LeccionesModal() {
    const { lecciones, leccionActiva, crearLeccion, cambiarLeccion, eliminarLeccion, setModalLeccionesAbierto } = useCajas();
    const [vista, setVista] = useState("lista"); // "lista" | "nueva"
    const [nombreNueva, setNombreNueva] = useState("");
    const [error, setError] = useState("");

    const handleCrear = () => {
        if (!nombreNueva.trim()) {
            setError("El nombre no puede estar vacío.");
            return;
        }
        if (lecciones.some(l => l.nombre.toLowerCase() === nombreNueva.trim().toLowerCase())) {
            setError("Ya existe una lección con ese nombre.");
            return;
        }
        crearLeccion(nombreNueva);
        setNombreNueva("");
        setError("");
    };

    const handleEliminar = (e, id) => {
        e.stopPropagation();
        if (window.confirm("¿Eliminás esta lección? Se perderán todas sus tarjetas.")) {
            console.log("Lección id: ", id)
            eliminarLeccion(id);
        }
    };

    return (
        <div className="lm-overlay" onClick={() => setModalLeccionesAbierto(false)}>
            <div className="lm-modal" onClick={e => e.stopPropagation()}>

                {/* Header del modal */}
                <div className="lm-header">
                    <div className="lm-tabs">
                        <button
                            className={`lm-tab ${vista === "lista" ? "lm-tab--active" : ""}`}
                            onClick={() => setVista("lista")}
                        >
                            Mis lecciones
                        </button>
                        <button
                            className={`lm-tab ${vista === "nueva" ? "lm-tab--active" : ""}`}
                            onClick={() => setVista("nueva")}
                        >
                            + Nueva lección
                        </button>
                    </div>
                    <button className="lm-close" onClick={() => setModalLeccionesAbierto(false)} aria-label="Cerrar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Vista: lista de lecciones */}
                {vista === "lista" && (
                    <div className="lm-body">
                        {lecciones.length === 0 ? (
                            <div className="lm-empty">
                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p>No tenés lecciones creadas todavía.</p>
                                <button className="lm-btn-primary" onClick={() => setVista("nueva")}>
                                    Crear primera lección
                                </button>
                            </div>
                        ) : (
                            <ul className="lm-list">
                                {lecciones.map(leccion => {
                                    const totalTarjetas = leccion.cajas.reduce((acc, c) => acc + (c.tarjetas?.length || 0), 0);
                                    const estaActiva = leccionActiva?._id === leccion._id;
                                    return (
                                        <li
                                            key={leccion._id}
                                            className={`lm-item ${estaActiva ? "lm-item--active" : ""}`}
                                            onClick={() => cambiarLeccion(leccion)}
                                        >
                                            <div className="lm-item-info">
                                                <span className="lm-item-nombre">{leccion.nombre}</span>
                                                <span className="lm-item-meta">{totalTarjetas} tarjeta{totalTarjetas !== 1 ? "s" : ""}</span>
                                            </div>
                                            <div className="lm-item-actions">
                                                {estaActiva && (
                                                    <span className="lm-badge-activa">Activa</span>
                                                )}
                                                <button
                                                    className="lm-btn-eliminar"
                                                    onClick={(e) => handleEliminar(e, leccion._id)}
                                                    aria-label="Eliminar lección"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                )}

                {/* Vista: nueva lección */}
                {vista === "nueva" && (
                    <div className="lm-body">
                        <div className="lm-nueva-form">
                            <label htmlFor="nombre-leccion" className="lm-label">
                                Nombre de la lección
                            </label>
                            <input
                                id="nombre-leccion"
                                type="text"
                                className={`lm-input ${error ? "lm-input--error" : ""}`}
                                placeholder="Ej: Inglés, Biología, Historia..."
                                value={nombreNueva}
                                onChange={e => { setNombreNueva(e.target.value); setError(""); }}
                                onKeyDown={e => e.key === "Enter" && handleCrear()}
                                autoFocus
                            />
                            {error && <p className="lm-error">{error}</p>}
                            <p className="lm-hint">
                                Cada lección tiene su propio sistema de 5 cajas Leitner.
                            </p>
                            <div className="lm-nueva-actions">
                                <button className="lm-btn-secondary" onClick={() => { setVista("lista"); setError(""); setNombreNueva(""); }}>
                                    Cancelar
                                </button>
                                <button className="lm-btn-primary" onClick={handleCrear}>
                                    Crear lección
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
