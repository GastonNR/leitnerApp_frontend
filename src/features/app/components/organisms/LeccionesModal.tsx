import { useState, MouseEvent, ChangeEvent, KeyboardEvent } from "react"
import { useLecciones } from "../../context/LeccionesContext"
import CustomButton from "../molecules/CustomButton"
import Button from "../atoms/Button";
import Paragraph from "../atoms/Paragraph";
import "./css/leccionesModal.css";
import IconSvg from "../atoms/IconSvg";
import Label from "../atoms/Label";
import Input from "../atoms/Input";

export default function LeccionesModal() {
    const { lecciones, leccionActiva, crearLeccion, cambiarLeccion, eliminarLeccion, setModalLeccionesAbierto } = useLecciones()
    const [vista, setVista] = useState<string>("lista")
    const [nombreNueva, setNombreNueva] = useState<string>("")
    const [error, setError] = useState<string>("")

    const handleCrear = async (): Promise<void> => {
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

    const handleEliminar = async (e: MouseEvent<HTMLButtonElement>, id: string): Promise<void> => {
        e.stopPropagation()
        if (window.confirm("¿Eliminás esta lección? Se perderán todas sus tarjetas.")) {
            console.log("Lección id: ", id)
            await eliminarLeccion(id)
        }
    }

    return (
        <div className="lm-overlay" onClick={() => setModalLeccionesAbierto(false)}>
            <div className="lm-modal" onClick={e => e.stopPropagation()}>

                {/* Header del modal */}
                <div className="lm-header">
                    <div className="lm-tabs">
                        <CustomButton
                            variante={'lm-header-btn'}
                            className={`lm-tab ${vista === "lista" ? "lm-tab--active" : ""}`}
                            texto='Mis lecciones'
                            onclick={() => setVista('lista')}
                        />

                        <CustomButton
                            variante={'lm-header-btn'}
                            className={`lm-tab ${vista === "nueva" ? "lm-tab--active" : ""}`}
                            texto='+ Nueva Lección'
                            onclick={() => setVista('nueva')}
                        />

                    </div>

                    <CustomButton
                        className={'lm-close'}
                        variante={'cerrar_btn'}
                        onclick={() => setModalLeccionesAbierto(false)}
                    />

                </div>

                {/* Vista: lista de lecciones */}
                {vista === "lista" && (
                    <div className="lm-body">
                        {lecciones.length === 0 ? (
                            <div className="lm-empty">
                                <IconSvg imagenSvg={'libro3'} />

                                <Paragraph texto={'No tenés lecciones creadas todavía.'} />

                                <Button className={'lm-btn-primary'} texto={'Crear primera lección'} onclick={() => setVista('nueva')} />

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
                                            onClick={() => cambiarLeccion(leccion._id)}
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
                                                    onClick={
                                                        (e: MouseEvent<HTMLButtonElement>) => handleEliminar(e, leccion._id)
                                                    }
                                                    aria-label="Eliminar lección"
                                                >
                                                    <IconSvg imagenSvg={'trash'} />
                                                    
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
                            <Label forId={'nombre-leccion'} classLabel={'lm-label'} text={'Nombre de la lección'} />

                            <Input
                                id={'nombre-leccion'}
                                type={'text'}
                                className={`lm-input ${error ? "lm-input--error" : ""}`}
                                placeholder={'Ej: Inglés, Biología, Historia...'}
                                value={nombreNueva}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setNombreNueva(e.target.value)
                                    setError("")
                                }}
                                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleCrear()}
                                autoFocus={true}
                            />

                            {error && <p className="lm-error">{error}</p>}

                            <Paragraph
                                className={'lm-hint'}
                                texto={'Cada lección tiene su propio sistema de 5 cajas Leitner.'}
                            />

                            <div className="lm-nueva-actions">

                                <Button
                                    className={'lm-btn-secondary'}
                                    texto={'Cancelar'}
                                    onclick={() => {
                                        setVista('lista')
                                        setError('')
                                        setNombreNueva('')
                                    }}
                                />

                                <Button
                                    className={'lm-btn-primary'}
                                    texto={'Crear lección'}
                                    onclick={handleCrear}
                                />

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
