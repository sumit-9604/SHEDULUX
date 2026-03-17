import { motion } from 'framer-motion'
import { useEffect } from 'react'
import AlgorithmSelector from '../components/simulation/AlgoSelector.jsx'
import ProcessForm from '../components/simulation/ProcessForm.jsx'
import CPUCore from '../components/simulation/CPUCore.jsx'
import ReadyQueue from '../components/simulation/ReadyQueue.jsx'
import PlaybackControls from '../components/simulation/PlaybackControls.jsx'
import GanttChart from '../components/dashboard/GanttChart.jsx'
import StatsPanel from '../components/dashboard/StatsPanel.jsx'
import ProcessTable from '../components/dashboard/ProcessTable.jsx'
import Loader from '../components/shared/Loader.jsx'
import useSimulation from '../Hooks/useSimulation.js'
import useSimulationStore from '../stores/simulationStore.js'
import { seedProcesses } from '../utils/helpers.js'
import Navbar from '../components/shared/Navbar.jsx'

export default function Simulator() {
  const { run } = useSimulation()
  const { loading, error, result, processes, addProcess, clearProcesses, setError } = useSimulationStore()

  useEffect(() => {
    if (processes.length === 0) {
      clearProcesses()
      seedProcesses().forEach(p => addProcess(p))
    }
  }, [])

  return (
    <>
    <Navbar/>
    <div className="flex h-[calc(100vh-52px)] overflow-hidden">
      

      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 flex-shrink-0 glass border-r border-accent/10 flex flex-col overflow-y-auto"
      >
        <div className="p-4 flex flex-col gap-5 flex-1">
          <AlgorithmSelector />
          <div className="h-px bg-white/5" />
          <ProcessForm />
        </div>

        <div className="p-4 flex flex-col gap-2">
          {error && (
            <div className="text-danger font-mono text-[10px] bg-danger/10 border border-danger/20 rounded px-3 py-2">
              {error}
            </div>
          )}
          <motion.button
            whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(124,92,255,0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setError(null); run() }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent/80 to-glow/80 border border-accent text-white font-hud text-[10px] tracking-[3px] py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'RUNNING...' : '▶ EXECUTE'}
          </motion.button>
        </div>
      </motion.div>

      {/* CENTER */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* CPU + READY QUEUE */}
        <div className="glass border-b border-accent/10 p-4 flex items-center gap-6 flex-shrink-0">
          <CPUCore />
          <ReadyQueue />
        </div>

        {/* GANTT + STATS + TABLE */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
          {loading && <Loader text="EXECUTING C++ ENGINE" />}

          {!loading && !result && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <div className="w-16 h-16 border border-accent/20 rounded-xl flex items-center justify-center">
                  <div className="w-8 h-8 border border-accent/40 rounded-lg" />
                </div>
              </motion.div>
              <p className="font-hud text-[10px] tracking-[3px] text-gray-600">
                ADD PROCESSES AND HIT EXECUTE
              </p>
            </div>
          )}

          {!loading && result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-5"
            >
              <div className="glass-card p-4"><GanttChart /></div>
              <StatsPanel />
              <div className="glass-card p-4"><ProcessTable /></div>
            </motion.div>
          )}
        </div>

        {result && <PlaybackControls />}
      </div>
    </div></>
  )
}