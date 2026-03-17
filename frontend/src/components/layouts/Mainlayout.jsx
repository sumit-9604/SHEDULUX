import { Outlet } from 'react-router-dom'
import Navbar from '../shared/Navbar.jsx'
import ParticleBackground from '../shared/ParticleBackground.jsx'

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
                <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}