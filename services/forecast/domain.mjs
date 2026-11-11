export async function operation({ asOf, observations }, advisory) {
  const now = Date.parse(asOf)
  if (!Number.isFinite(now) || !Array.isArray(observations)) throw new TypeError('Expected asOf and observations')
  const recent = observations.filter(({ time, waveFeet, windMph }) => {
    const age = now - Date.parse(time)
    if (!Number.isFinite(age) || ![waveFeet, windMph].every(value => Number.isFinite(value) && value >= 0)) {
      throw new TypeError('Each observation needs a timestamp, wave feet and wind mph')
    }
    return age >= 0 && age <= 2 * 60 * 60 * 1000
  })
  const samples = recent.length
  const meanWaveFeet = samples ? Math.round(10 * recent.reduce((sum, reading) => sum + reading.waveFeet, 0) / samples) / 10 : null
  const maxWindMph = samples ? Math.max(...recent.map(reading => reading.windMph)) : null
  return { samples, meanWaveFeet, maxWindMph, ...await advisory({ samples, meanWaveFeet, maxWindMph }) }
}
