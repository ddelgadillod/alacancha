import { useNavigate } from 'react-router-dom'
import axios from 'axios';


export default function Search() {
  const navigate = useNavigate()
  
  
  const handleClick = () => {
    axios.get('https://api.alacancha.online/api/spot/buscarcupos', { params: { deporte: 'futbol' }})
    .then((response) => {
      console.log(JSON.stringify(response.data));
      if(response.data.cupos.length > 0){
        navigate('/results', { state: response.data.cupos })
      }
    })
    .catch((error) => {
      console.log(error);
    });

    // Aquí podrías enviar datos de búsqueda a un estado global o API si quieres
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1">
        <div className="w-full max-w-sm shrink-0 p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          <div className="rounded-xl bg-gray-900/80 p-6 shadow-2xl backdrop-blur-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-white tracking-tight">Busca tu próximo partido</h2>
            <p className="mt-1 text-base text-gray-400">Filtra por deporte y encuentra canchas disponibles.</p>
            <div className="mt-6 space-y-4">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> sports_soccer </span>
                <select className="form-select w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-10 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50">
                  <option>Fútbol</option>
                  <option>Baloncesto</option>
                  <option>Béisbol</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> calendar_today </span>
                  <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Fecha" type="text" />
                </div>
                <div className="relative w-full">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> schedule </span>
                  <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Hora" type="text" />
                </div>
              </div>
              <button
              onClick={handleClick}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-12 px-4 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[var(--primary-color)]/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-[var(--primary-color)]/30"
            >
              <span className="material-symbols-outlined mr-2">search</span>
              <span className="truncate">Buscar</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
