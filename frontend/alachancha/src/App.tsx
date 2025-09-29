import './App.css'
import { Routes, Route } from 'react-router-dom'
import Search from './pages/Search'
import Results from './pages/Results'
import Reserve from './pages/Reserve'
import Profile from './pages/Profile'
import CreateSlot from './pages/CreateSlot'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Search />} />
      <Route path="/create" element={<CreateSlot />} />
      <Route path="/results" element={<Results />} />
      <Route path="/reserve" element={<Reserve />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App
