const API_BASE_URL = import.meta.env.VITE_OPENF1_API_URL

const fetchOpenF1 = async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
        throw new Error(`Error al consultar la API de OpenF1: ${response.status}`)
    }
    return response.json()
}

export const getRaceSessions = (year = new Date().getFullYear()) =>
    fetchOpenF1(`/sessions?session_name=Race&year=${year}`)

export const getSessionResults = (sessionKey) =>
    fetchOpenF1(`/session_result?session_key=${sessionKey}`)

export const getDriversInfo = (sessionKey) =>
    fetchOpenF1(`/drivers?session_key=${sessionKey}`)

const formatLapTime = (secondsOrString) => {
    if (secondsOrString == null || secondsOrString === "") return "-"

    if (typeof secondsOrString === "string") {
        return secondsOrString
    }

    const totalSeconds = Number(secondsOrString)
    if (!Number.isFinite(totalSeconds)) return "-"

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds - minutes * 60
    return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`
}

const getStatusText = (result) => {
    return (
        result.status ||
        result.result_status ||
        result.classification_status ||
        result.dnf_reason ||
        (result.position != null ? "Finalizada" : "Sin clasificar")
    )
}

/**
 * Combina los resultados de una carrera con la información de los pilotos
 * y ordena por posición final.
 */
export const getRaceDetails = async (sessionKey) => {
    const [results, drivers] = await Promise.all([
        getSessionResults(sessionKey),
        getDriversInfo(sessionKey),
    ])

    const driversMap = new Map(drivers.map((d) => [d.driver_number, d]))

    const combined = results.map((result) => {
        const driver = driversMap.get(result.driver_number)
        return {
            ...result,
            driver_name: driver?.full_name || driver?.name_acronym || `Piloto ${result.driver_number}`,
            driver_code: driver?.name_acronym || "",
            team_name: driver?.team_name || "",
            country_code: driver?.country_code || "",
            team_colour: driver?.team_colour || "",
            grid_position: result.grid_position ?? result.starting_position ?? null,
            laps_completed: result.laps_completed ?? result.laps ?? null,
            gap_to_leader:
                result.gap_to_leader ??
                result.time_gap ??
                result.interval ??
                result.time_diff ??
                "-",
            best_lap: formatLapTime(result.fastest_lap ?? result.best_lap_time ?? result.best_lap),
            status_text: getStatusText(result),
        }
    })

    return combined.sort((a, b) => {
        const posA = a.position ?? Infinity
        const posB = b.position ?? Infinity
        if (posA !== posB) return posA - posB
        return (a.driver_number || 0) - (b.driver_number || 0)
    })
}
