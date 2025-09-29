export default function ProfileItem() {

  return (
    <div className="w-full flex flex-col overflow-hidden">
      <div className="grid p-6 grid-cols-1 lg:grid-cols-3 gap-8 overflow-auto">
        <div className="lg:col-span-1 flex flex-col items-center">
          <div className="relative h-40 w-40">
            <img alt="Avatar" className="h-full w-full rounded-full object-cover" src="https://lh3.googleusercontent.com/a/ACg8ocK_gSj3YwJ5RrfnS_YjIDuW3B2dYpZXsszVBG8qW-A=s96-c"/>
              <button className="absolute bottom-1 right-1 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary-color)] text-white hover:bg-opacity-90" type="button">
                <span className="material-symbols-outlined text-xl"> edit </span>
              </button>
          </div>
          <div className="mt-4 w-full space-y-2">
            <label className="flex w-full cursor-pointer items-center justify-center rounded-lg h-11 px-4 bg-gray-700 text-white text-sm font-medium transition-colors hover:bg-gray-600">
              <span className="material-symbols-outlined mr-2 text-base"> cloud_upload </span>
              <span>Subir Foto</span>
            </label>
            <input className="sr-only" id="photo-upload" type="file"/>
              <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-11 px-4 bg-gray-800 text-gray-300 text-sm font-medium transition-colors hover:bg-gray-700" type="button">
                <span className="material-symbols-outlined mr-2 text-base"> emoji_emotions </span>
                <span>Elegir Avatar</span>
              </button>
          </div>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> person </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Nombres y Apellidos" type="text"/>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> military_tech </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Apodo" type="text"/>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"> schedule </span>
            <input className="form-input w-full rounded-lg border border-gray-600 bg-gray-800 py-3 pl-12 pr-4 text-base text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-opacity-50" placeholder="Horarios Disponibles" type="text"/>
          </div>
          <div className="sm:col-span-2 space-y-2">
            <label className="text-base text-gray-400">Radio de Búsqueda: <span className="font-bold text-white" id="radius-value">25 Km</span></label>
            <div className="relative">
              <input className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb" id="search-radius" max="50" min="1" type="range" value="25"/>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-lg font-medium text-white">Deportes de Interés</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" type="checkbox"/>
                <span className="text-white">Fútbol</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" type="checkbox"/>
                <span className="text-white">Baloncesto</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" type="checkbox"/>
                <span className="text-white">Béisbol</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input className="form-checkbox h-5 w-5 rounded bg-gray-700 border-gray-600 text-[var(--primary-color)] focus:ring-[var(--primary-color)]" type="checkbox"/>
                <span className="text-white">Voleibol</span>
            </label>
          </div>
        </div>
      </div>
      <div className="p-6 flex border-t-2 border-gray-600">
        <button className="flex w-full sm:w-auto cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-[var(--primary-color)] text-white text-base font-bold leading-normal tracking-wide shadow-lg shadow-[var(--primary-color)]/20 transition-all hover:bg-opacity-90 hover:shadow-xl hover:shadow-[var(--primary-color)]/30" type="submit">
          <span className="material-symbols-outlined mr-2"> save </span>
          <span className="truncate">Guardar Perfil</span>
        </button>
      </div>
    </div>
  )
}