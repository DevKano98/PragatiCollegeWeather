import { useCallback, useState } from 'react'

// Thin wrapper over the Geolocation API. Resolves with { lat, lon } or rejects
// with a friendly reason string. Never throws synchronously.
export function useGeolocation() {
  const [locating, setLocating] = useState(false)

  const locate = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!('geolocation' in navigator)) {
        reject('unsupported')
        return
      }
      setLocating(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocating(false)
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          })
        },
        (err) => {
          setLocating(false)
          reject(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      )
    })
  }, [])

  return { locate, locating }
}
