export default function CreateSlot() {
  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="w-full h-100 flex flex-col p-6 ">
        <h2 className="text-2xl font-bold text-white tracking-tight">Cupos</h2>
        <p className="mt-1 text-base text-gray-400">Crea un cupo para informar a los demás que los necesitas</p>
      </div>
      <div className="grid p-6 grid-cols-1 lg:grid-cols-3 gap-8 overflow-auto">
        <div className="lg:col-span-1 flex flex-col items-center">

        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> sports_soccer </span>
            <select className="form-select w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-10 text-base text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50">
              <option>Fútbol</option>
              <option>Baloncesto</option>
              <option>Béisbol</option>
            </select>
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> person </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Rol" type="text" />
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> calendar_today </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Fecha" type="text" />
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> schedule </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Hora" type="text" />
          </div>
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> schedule </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Duración" type="text" />
          </div>
          <div className="sm:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> payments </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Valor inscripción" type="text" />
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> place </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Lugar" type="text" />
          </div>
        </div>
      </div>
      <div className="p-6 flex border-t-2 border-gray-600">
        <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[var(--primary-color)]/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-[var(--primary-color)]/30" type="submit">
          <span className="material-symbols-outlined mr-2"> check </span>
          <span className="truncate">Crear cupo</span>
        </button>
      </div>
    </div>
  )
}