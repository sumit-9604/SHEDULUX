import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layouts/MainLayout.jsx'
import Home from './pages/Home.jsx'
import Simulator from './pages/Simulator.jsx'
import Compare from './pages/Compare.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="simulator" element={<Simulator />} />
        <Route path="compare" element={<Compare />} />
      </Route>
    </Routes>
  )
}