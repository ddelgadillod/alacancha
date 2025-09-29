import { useState } from 'react'
import ProfileItem from './ProfileItem'
import History from './History'


export default function Profile() {
  const [tab, setTab] = useState('profile');

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden">
      <div className="flex flex-1 items-center overflow-hidden flex-col">
        <div className="flex flex-row w-full px-4 border-b-2 border-gray-600 justify-between">
          <div onClick={() => setTab('profile')} className={`bg-[var(--primary-backgroun-color)] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${tab == 'profile' ? 'border-[var(--primary-color)] text-white': 'border-transparent'} hover:text-white hover:border-[var(--primary-color)]`}>
            Mi Perfil
          </div>
          <div onClick={() => setTab('history')} className={`bg-[var(--primary-backgroun-color)] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors ${tab == 'history' ? 'border-[var(--primary-color)] text-white': 'border-transparent'} hover:text-white hover:border-[var(--primary-color)]`}>
            Historial de Participaciones
          </div>
        </div>
        <div className="flex flex-1 w-full overflow-auto">
          {tab == 'profile' ? <ProfileItem/>:<History/>}
        </div>

      </div>
    </div>
  )
}