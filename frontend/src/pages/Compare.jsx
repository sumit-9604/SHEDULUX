import { useState } from 'react'
import { motion } from 'framer-motion'
import { runCompare } from '../services/api.js'
import useSimulationStore from '../stores/simulationStore.js'
import Loader from '../components/shared/Loader.jsx'

export default function Compare() {
  const { processes } = useSimulationStore()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleCompare() {
    if (!processes.length) { setError('Add processes in the Simulator first'); return }
    setLoading(true); setError(null)
    try {
      const data = await runCompare(processes)
      setResults(data.filter(r => !r.error))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="font-hud text-[9px] tracking-[4px] text-accent mb-2">ALGORITHM COMPARISON</div>
        <h2 className="font-hud text-2xl font-black text-white mb-6">Compare All Algorithms</h2>

        {error && <div className="text-danger font-mono text-sm mb-4">{error}</div>}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCompare}
          disabled={loading}
          className="mb-6 px-6 py-2.5 bg-gradient-to-r from-accent to-cyan text-white font-hud text-[10px] tracking-[3px] rounded-lg disabled:opacity-50"
        >
          {loading ? 'RUNNING ALL...' : 'RUN COMPARISON'}
        </motion.button>

        {loading && <Loader text="RUNNING ALL ALGORITHMS" />}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((r, i) => (
              <motion.div
                key={r.algo}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4"
              >
                <div className="font-hud text-[11px] tracking-[2px] text-accent mb-3 border-b border-white/5 pb-2">
                  {r.algo}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { l: 'AVG WAIT', v: r.stats?.avgWT, c: '#7c5cff' },
                    { l: 'AVG TAT', v: r.stats?.avgTAT, c: '#00e5b0' },
                    { l: 'THROUGHPUT', v: r.stats?.throughput, c: '#ffb400' },
                    { l: 'MAX TIME', v: r.stats?.maxT, c: '#ff4daa' },
                  ].map(s => (
                    <div key={s.l} className="bg-white/3 rounded p-2">
                      <div className="font-mono text-[8px] text-gray-600">{s.l}</div>
                      <div className="font-hud text-[15px] font-bold" style={{ color: s.c }}>{s.v}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}