import { useEffect, useMemo } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useWeather } from '@/context/WeatherContext'
import { useSettings } from '@/hooks/useSettings'
import { formatTemp } from '@/utils/format'

/*
  Interactive weather map. This module is loaded lazily (see MapCard) so Leaflet
  is kept out of the initial bundle.

  Behaviours:
    - styled temperature badge marker (L.divIcon)
    - animated flyTo when the active location changes
    - click anywhere → reverse-geocode → fetch → move marker → update dashboard
*/

// Build a divIcon badge showing the current temperature.
function tempIcon(label) {
  return L.divIcon({
    className: '',
    html: `<div class="temp-badge">${label}</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
  })
}

// Imperatively recenter the map with a smooth flyTo on location change.
function Recenter({ lat, lon }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo([lat, lon], Math.max(map.getZoom(), 9), { duration: 1.1 })
  }, [lat, lon, map])
  return null
}

// Translate map clicks into a coordinate selection.
function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function WeatherMap({ className }) {
  const { location, bundle, selectCoords } = useWeather()
  const { settings } = useSettings()

  const center = location ? [location.lat, location.lon] : [19.076, 72.8777]
  const tempLabel = useMemo(
    () =>
      bundle?.current
        ? formatTemp(bundle.current.temp, settings.tempUnit)
        : '…',
    [bundle?.current, settings.tempUnit]
  )

  return (
    <MapContainer
      center={center}
      zoom={9}
      scrollWheelZoom
      className={className}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location && (
        <>
          <Marker position={[location.lat, location.lon]} icon={tempIcon(tempLabel)}>
            <Popup>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{location.name}</span>
                <span className="tabnum text-muted-foreground">
                  {tempLabel}
                </span>
              </div>
            </Popup>
          </Marker>
          <Recenter lat={location.lat} lon={location.lon} />
        </>
      )}
      <ClickHandler onPick={selectCoords} />
    </MapContainer>
  )
}
