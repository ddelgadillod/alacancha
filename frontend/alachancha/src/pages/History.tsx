export default function History() {

 const historyItem = [
    { id: 1, sport: 'Fútbol', slot: 'Delantero', date: '15 de Mayo, 2023', place: 'Canchas del Sol', score: 5 },
    { id: 2, sport: 'Fútbol', slot: 'Defensa',   date: '20 de Mayo, 2023', place: 'Canchas del Sol', score: 4 },
    { id: 3, sport: 'Básquet', slot: 'Base',     date: '22 de Mayo, 2023', place: 'Coliseo Norte',   score: 5 },
    { id: 4, sport: 'Tenis',   slot: 'Individual',date: '25 de Mayo, 2023', place: 'Club Central',   score: 5 },
  ];

  return (
    <div className='flex flex-1 w-full h-full gap-6 flex-col overflow-auto p-6'>
      {historyItem.map(({id, sport, slot, date, place, score }) => {
                      return (
                        <div key={id} className="bg-gray-800/50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="md:col-span-2">
                            <p className="text-lg font-bold text-white">{sport}</p>
                            <p className="text-sm text-gray-400">{slot}</p>
                          </div>
                          <div className="text-sm text-gray-300">
                            <p><span className="font-semibold">Fecha:</span> {date}</p>
                            <p><span className="font-semibold">Lugar:</span> {place}</p>
                          </div>
                          <div className="flex items-center gap-2 justify-center">
                            <span className="material-symbols-outlined text-yellow-400">star</span>
                            <span className="text-white font-bold text-lg">{score} / 5</span>
                          </div>
                        </div>
                      )
                    })}


    </div>
  )
}