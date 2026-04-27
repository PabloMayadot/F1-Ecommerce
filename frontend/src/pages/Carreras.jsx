import { useState, useEffect } from "react"
import { getRaceSessions, getRaceDetails } from "../services/openf1Api"
import "../styles/carreras.css"

const AÑO_ACTUAL = new Date().getFullYear()
const AÑOS_DISPONIBLES = Array.from({ length: 5 }, (_, i) => AÑO_ACTUAL - i)
const HOY = () => new Date()

const getSessionEndDate = (session) => {
    const value = session?.date_end || session?.date_start
    return value ? new Date(value) : null
}

const isSessionDisputed = (session) => {
    const endDate = getSessionEndDate(session)
    if (!endDate || Number.isNaN(endDate.getTime())) return false
    return endDate <= HOY()
}

const getNoResultsMessage = (session) => {
    const year = new Date(session?.date_start || Date.now()).getFullYear()
    const country = (session?.country_name || "").toLowerCase()

    if (year === 2026 && (country.includes("bahrain") || country.includes("saudi"))) {
        return "En 2026 esta carrera no se corrió por seguridad ante el conflicto bélico entre Irán e Israel/EEUU."
    }

    return "Esta carrera aún no se disputó o la organización todavía no publicó los resultados oficiales."
}

const formatGapWithPlus = (gap) => {
    if (gap == null) return "-"
    const raw = String(gap).trim()
    if (!raw || raw === "-") return "-"
    if (raw.startsWith("+") || raw.startsWith("-")) return raw
    return `+${raw}`
}

export default function Carreras() {
    const [sessions, setSessions] = useState([])
    const [sessionSeleccionada, setSessionSeleccionada] = useState(null)
    const [resultados, setResultados] = useState([])
    const [cargandoSesiones, setCargandoSesiones] = useState(true)
    const [cargandoResultados, setCargandoResultados] = useState(false)
    const [errorSesiones, setErrorSesiones] = useState(null)
    const [errorResultados, setErrorResultados] = useState(null)
    const [añoSeleccionado, setAñoSeleccionado] = useState(AÑO_ACTUAL)

    useEffect(() => {
        cargarSesiones(añoSeleccionado)
    }, [añoSeleccionado])

    const cargarSesiones = async (year) => {
        setCargandoSesiones(true)
        setErrorSesiones(null)
        try {
            const data = await getRaceSessions(year)
            const sesionesDisputadas = [...(data || [])].filter(isSessionDisputed)
            const sesionesOrdenadas = sesionesDisputadas.sort(
                (a, b) => new Date(a.date_start) - new Date(b.date_start)
            )
            setSessions(sesionesOrdenadas)

            // Seleccionar automáticamente la última carrera disponible
            if (sesionesOrdenadas.length > 0) {
                seleccionarSession(sesionesOrdenadas[sesionesOrdenadas.length - 1])
            } else {
                setSessionSeleccionada(null)
                setResultados([])
            }
        } catch {
            setErrorSesiones("Error al cargar el calendario de carreras.")
        } finally {
            setCargandoSesiones(false)
        }
    }

    const seleccionarSession = async (session) => {
        // Importante: limpiar resultados previos para evitar que queden visibles si la API no devuelve datos
        setResultados([])
        setSessionSeleccionada(session)
        setCargandoResultados(true)
        setErrorResultados(null)
        try {
            const detalles = await getRaceDetails(session.session_key)
            setResultados(detalles)
        } catch (err) {
            setResultados([])
            setErrorResultados(getNoResultsMessage(session))
        } finally {
            setCargandoResultados(false)
        }
    }

    return (
        <div className="race-results-page">
            <main>
                <h1>Resultados de Carreras</h1>

                <div className="year-selector">
                    <label htmlFor="year-select">Temporada:</label>
                    <select
                        id="year-select"
                        value={añoSeleccionado}
                        onChange={(e) => setAñoSeleccionado(Number(e.target.value))}
                    >
                        {AÑOS_DISPONIBLES.map((año) => (
                            <option key={año} value={año}>{año}</option>
                        ))}
                    </select>
                </div>

                {errorSesiones && <div className="error-message">{errorSesiones}</div>}

                {cargandoSesiones ? (
                    <div className="loading">Cargando calendario...</div>
                ) : sessions.length === 0 ? (
                    <div className="no-races">
                        No hay carreras disputadas para la temporada {añoSeleccionado} hasta la fecha actual.
                    </div>
                ) : (
                    <div className="races-list">
                        <h2>Carreras Disputadas</h2>
                        <div className="races-grid">
                            {sessions.map((session) => (
                                <div
                                    key={session.session_key}
                                    className={`race-card ${sessionSeleccionada?.session_key === session.session_key ? "active" : ""}`}
                                    onClick={() => seleccionarSession(session)}
                                >
                                    <div className="race-card-header">
                                        <h3>{session.country_name || session.location}</h3>
                                        <span className="race-date">
                                            {new Date(session.date_start).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="race-card-info">
                                        <p><strong>Circuito:</strong> {session.circuit_short_name}</p>
                                        <p><strong>Sesión:</strong> Carrera</p>
                                        <p><strong>País:</strong> {session.country_name || "-"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="race-results-section">
                    {cargandoResultados && <div className="loading">Cargando resultados...</div>}
                    {errorResultados && <div className="error-message">{errorResultados}</div>}

                    {!cargandoResultados && !errorResultados && sessionSeleccionada && resultados.length > 0 && (
                        <div>
                            <h2>
                                Resultados: {sessionSeleccionada.country_name} — {new Date(sessionSeleccionada.date_start).toLocaleDateString()}
                            </h2>
                            <div className="results-table-container">
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Pos</th>
                                            <th>Nº</th>
                                            <th>Piloto</th>
                                            <th>Equipo</th>
                                            <th>Diferencia</th>
                                            <th>Puntos</th>
                                            <th>Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.map((result, idx) => (
                                            <tr key={idx}>
                                                <td className="position-cell">{result.position ?? "-"}</td>
                                                <td>{result.driver_number}</td>
                                                <td className="driver-cell">
                                                    {result.driver_name} <span className="driver-code">({result.driver_code})</span>
                                                </td>
                                                <td className="team-cell">{result.team_name}</td>
                                                <td>{formatGapWithPlus(result.gap_to_leader)}</td>
                                                <td>{result.points ?? "-"}</td>
                                                <td>{result.status_text ?? "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {!cargandoResultados && sessionSeleccionada && resultados.length === 0 && !errorResultados && (
                        <div className="no-results">
                            {getNoResultsMessage(sessionSeleccionada)}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
