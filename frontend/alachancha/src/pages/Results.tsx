import React, { useState } from 'react'
import { APIProvider, Map, Marker, useMap  } from '@vis.gl/react-google-maps';
import Reserve from './Reserve';
import { useLocation } from 'react-router-dom';

function FitBounds({ markers }: { markers: { lat:number, lon:number }[] }) {
  const map = useMap(); // obtiene el objeto google.maps.Map

  React.useEffect(() => {
    if (!map || markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    markers.forEach(m => bounds.extend({ lat: m.lat, lng: m.lon }));

    // Ajusta el mapa a los marcadores
    map.fitBounds(bounds);
  }, [map, markers]);

  return null; // no renderiza nada, solo ejecuta la lógica
}

export interface MarkerStruct {
  id: number
  lat: number
  lon: number
  lugar: string
  fecha: string  // o Date si manejas objetos Date
}

export default function Results() {
  const [selectedMarker, setSelectedMarker] = useState<null | {
    id: number
    lugar: string
    fecha : string
  }>(null);
  const location = useLocation();
  const markers = location.state;
  debugger;
  // Marcadores de ejemplo
  /* const markers = [
    { id: 1, position: { lat: 6.252, lng: -75.56 }, title: 'Cancha 1', reserva: 'Reserva de 8:00 a 9:00 AM' },
    { id: 2, position: { lat: 6.255, lng: -74.565 }, title: 'Cancha 2', reserva: 'Reserva de 10:00 a 11:00 AM' },
  ] */

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col">
        <div className="w-full h-100 flex flex-col p-6 ">
          <h2 className="text-2xl font-bold text-white tracking-tight">Resultados</h2>
          <p className="mt-1 text-base text-gray-400">Selecciona un marcado para ir al detalle</p>
        </div>

        <div className="w-full flex-1 shrink-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <Map
              defaultZoom={3}
              defaultCenter={{ lat: 22.54992, lng: 0 }}
              gestureHandling={'greedy'}
              disableDefaultUI={true}
            >
              {
              markers.map(({id, lat, lon, lugar, fecha }:MarkerStruct) => {
                console.log({ lat: lat, lng: lon })
                return (
                  <Marker
                    key={id}
                    position={{ lat: lat, lng: lon }}
                    clickable={true}
                    onClick={() => setSelectedMarker({ id, lugar, fecha  })}
                    title={lugar}
                  />
                )
              })}
              <FitBounds markers={markers} />
            </Map>
          </APIProvider>
        </div>

        

      </div>
      {/* Modal */}
      {selectedMarker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Reserve/>
        </div>
      )}

    </div>
  )
}