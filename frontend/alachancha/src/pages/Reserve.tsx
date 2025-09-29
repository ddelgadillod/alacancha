import { useNavigate } from 'react-router-dom'


export default function Reserve() {
  const navigate = useNavigate()

  const handleClick = () => {
    // Aquí podrías enviar datos de búsqueda a un estado global o API si quieres
    navigate('/') // 👈 navega a la otra pantalla
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 items-center p-4 overflow-hidden">
        <div className="w-full h-full p-4 flex overflow-hidden">
          <div className="rounded-xl bg-[var(--primary-backgroun-color)] shadow-2xl backdrop-blur-lg border border-gray-700 flex flex-col overflow-hidden">
            <h2 className="px-6 text-2xl font-bold text-white tracking-tight">Detalle de partido</h2>
            <p className="px-6 py-4 text-base text-gray-400 border-b-2 border-gray-600">Información sobre el partido, si te gusta reserva.</p>
            <div className='p-6 flex flex-1 overflow-auto flex-col gap-6'>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">sports_soccer</span>
                  <div>
                    <p className="text-sm text-gray-400">Deporte</p>
                    <p className="font-semibold text-white">Fútbol</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">schedule</span>
                  <div>
                    <p className="text-sm text-gray-400">Duración</p>
                    <p className="font-semibold text-white">90 Minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">payments</span>
                  <div>
                    <p className="text-sm text-gray-400">Valor Inscripción</p>
                    <p className="font-semibold text-white">$5.00 USD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">place</span>
                  <div>
                    <p className="text-sm text-gray-400">Lugar</p>
                    <p className="font-semibold text-white">Canchas Sintéticas "El Golazo"</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">calendar_today</span>
                  <div>
                    <p className="text-sm text-gray-400">Fecha</p>
                    <p className="font-semibold text-white">Viernes, 28 de Junio, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">access_time</span>
                  <div>
                    <p className="text-sm text-gray-400">Hora de Inicio</p>
                    <p className="font-semibold text-white">19:00</p>
                  </div>
                </div>

            </div>
            {/* <div className='flex-1 overflow-auto md:overflow-scroll'>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">sports_soccer</span>
                  <div>
                    <p className="text-sm text-gray-400">Deporte</p>
                    <p className="font-semibold text-white">Fútbol</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">schedule</span>
                  <div>
                    <p className="text-sm text-gray-400">Duración</p>
                    <p className="font-semibold text-white">90 Minutos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">payments</span>
                  <div>
                    <p className="text-sm text-gray-400">Valor Inscripción</p>
                    <p className="font-semibold text-white">$5.00 USD</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">place</span>
                  <div>
                    <p className="text-sm text-gray-400">Lugar</p>
                    <p className="font-semibold text-white">Canchas Sintéticas "El Golazo"</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">calendar_today</span>
                  <div>
                    <p className="text-sm text-gray-400">Fecha</p>
                    <p className="font-semibold text-white">Viernes, 28 de Junio, 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="material-symbols-outlined text-[var(--primary-color)] text-3xl">access_time</span>
                  <div>
                    <p className="text-sm text-gray-400">Hora de Inicio</p>
                    <p className="font-semibold text-white">19:00</p>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white">Participantes</h3>
                  <div className="flex gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Cupos Ocupados</p>
                      <p className="text-xl font-bold text-white">8</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Cupos Disponibles</p>
                      <p className="text-xl font-bold text-green-400">2</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de ElCapi" className="h-24 w-24 rounded-full object-cover border-4 border-[var(--primary-color)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoYettpEjC4NbrH7RVNLazUDGVA5tL-R1qrwYk1Sz-tg6DD_RLE7xgCf3uimZTpTmyYjGkQp8eZ9qq2bQKi2Zm2e8n3Hc3soiC2x91c0ibBm3RS6gKBM5XIywpXFeZiwnOYAHrMmQyJhscSgvhMi3Pc_PuLyu3HpUkxvLbBZ6aSo8tPF8FRzJzAh8I5375WL-3N8Vt-CmFuWEqFWJciAbbkY9bTljJ0UqXkTRQwsLUn08YC3tk-h5j2U_EV23w7B-ozZPVsPqozqw"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">ElCapi</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de Goleador92" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAszczLKs6J1xEegcnNk9AM6JzAcKiD8BFb9w3keIPG-XOdZE-BDjBYVshZ06ZnLJsBY--_hgYxhQ2uwBVl9JIUoZ7a06nt6fysKjYCXp1GSqZm5e6FJ80ZEhQM7K_0TnnvXyHvT310tkFnm4KeRnu6C-mrdpXDGu_ewX7d0P-SpFbyNKzV0VLzP9valSo6F27Cm2S-TsUlbsyzMFUKz9Lc7GRiUyve9HFNTBMIrG4CY-KHEDXh8bA4Q4MblWSKJdt5I5ujIdfrO_s"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">Goleador92</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de LaMuralla" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWBHQTC8rc8UEC6JokS9IYkFITbEvNYI6tiogBT9BtlSgoPlIJR90r2AioPeaoQ9GpN1_XX4fiXKGJhvC-60s-XOb5aUxC6_PdTLOpnqrwtqNfF--ILnpqiVKDTEQCRkVAzF_28tFQLdA8vp04miX80RuG2FBU53W6ZghluCGPNTyjZDHCZOpe0YDTjR5EjTR5Swb7bVcIPl1wZw7vhfBMj4uXqcf7pIQ20x7UP7gCJ19bEApJzIpCKMCtjr_UqbIBpuKieaLAMls"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">LaMuralla</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de RayoVeloz" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9ENVH23OmBpwhOjFYUvmbfzyTDapHTCobJRnsqv6JH1WpSNhtavg5-4S2sQvy10q6q0y8jERzW2rutrpHuCaKCGM77roXkLTuHRQzt0e5N1HvFWlkD_VKliDaahcPzd1gWPIPP-Jsd-7MmLutS5KIXAO3CdkwBbsOParZsRgqRwCZoqkX_RyliYBfRe3_5mxRaEcJQ-AH_hLLDWNbuMEmUM7OPRjwUfkq9QQoHq9JYkKfPBwvsafq6T1XxQmQSjK5UCPgEOwWIEc"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">RayoVeloz</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de Titán" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV0FH21f-vUzTXZodQFW47xKdOgLRyd_KOCbusqr0HvxjTEuDpU5VUcUNeojZJ3ImRrp2hE9LzUapHLZABJLO2tnnDBPuVT_uhbiTexDlteztAwRL-WMkwonVjuhP2sprCLgKXL_ZbyUHv_-fNhzQZVm5axrdETHyxYnaPDUEBcRv9Uru653ZfK80seiuwLtyrpOGlTSawHR-rXEfPHgco8O577yRjB9WZY1A9ZGgjpCq9pynM1thJ9TPylkZV0gtyvj9IikRClEc"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">Titán</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de Mago" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFVFZOJyvW9CsCAzlkiCooGVki4-Pklq4G_YBBh9oQdYhCqA62Ej7agU6zXBlccU5GVAsGkkT3xqF7G0oBsvbtQtgn7FiSqXviwx1saBCRE3bp4lrsBMcbna9ZaPeyaxt-O5C7fhQLknmrqW_BAdEyxP7M8HUy7ySCklGLD2oUIg4ivfJ6LRdHS62gkox54ZOhRc-OM5si27Bfe-TRz4gciWPJ_vmdh9up1OzcsY4VMjAPFs5FimSMwd4Cb3ILccZc9lAYFb6NwUs"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">Mago</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <img alt="Avatar de FuriaRoja" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFVFZOJyvW9CsCAzlkiCooGVki4-Pklq4G_YBBh9oQdYhCqA62Ej7agU6zXBlccU5GVAsGkkT3xqF7G0oBsvbtQtgn7FiSqXviwx1saBCRE3bp4lrsBMcbna9ZaPeyaxt-O5C7fhQLknmrqW_BAdEyxP7M8HUy7ySCklGLD2oUIg4ivfJ6LRdHS62gkox54ZOhRc-OM5si27Bfe-TRz4gciWPJ_vmdh9up1OzcsY4VMjAPFs5FimSMwd4Cb3ILccZc9lAYFb6NwUs"/>
                        <button className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white transition-transform hover:scale-110">
                          <span className="material-symbols-outlined text-base">star</span>
                        </button>
                    </div>
                    <p className="mt-4 font-semibold text-white">FuriaRoja</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <img alt="Avatar de JugadorActual" className="h-24 w-24 rounded-full object-cover border-4 border-gray-700" src="https://lh3.googleusercontent.com/a/ACg8ocK_gSj3YwJ5RrfnS_YjIDuW3B2dYpZXsszVBG8qW-A=s96-c"/>
                      <p className="mt-2 font-semibold text-white">TuApodo</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-600 rounded-full h-24 w-24 bg-gray-800/50">
                    <span className="text-3xl text-gray-500">+</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-600 rounded-full h-24 w-24 bg-gray-800/50">
                    <span className="text-3xl text-gray-500">+</span>
                  </div>
                </div>
              </div>
              <div className="mt-10 flex justify-end">
                <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[var(--primary-color)]/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-[var(--primary-color)]/30">
                  <span className="material-symbols-outlined mr-2">login</span>
                  <span className="truncate">Unirse al Partido</span>
                </button>
              </div>
            </div> */}
            <form className="p-6 border-t-2 border-gray-600">
              <button
                onClick={handleClick}
                className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[var(--primary-color)]/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-[var(--primary-color)]/30"
              >
                <span className="material-symbols-outlined mr-2">check</span>
                <span className="truncate">Reservar</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  )
}