import { motion as Motion} from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function StatsPanel() {
  const { result } = useSimulationStore()
  if (!result) return null
  const { stats } = result

  const cards = [
    { label: 'AVG WAIT TIME', value: stats.avgWT, color: '#7c5cff', unit: 'units' },
    { label: 'AVG TURNAROUND', value: stats.avgTAT, color: '#00e5b0', unit: 'units' },
    { label: 'THROUGHPUT', value: stats.throughput, color: '#ffb400', unit: 'P/T' },
    { label: 'CPU UTILISATION', value: stats.utilization + '%', color: '#ff4daa', unit: '' },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c, i) => (
        <Motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-3"
        >
          <div className="font-mono text-[8px] tracking-[1.5px] text-gray-600 mb-1">{c.label}</div>
          <div className="font-hud text-[22px] font-black" style={{ color: c.color }}>
            {c.value}
          </div>
          <div className="h-0.5 bg-white/5 rounded mt-2 overflow-hidden">
            <Motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, delay: i * 0.1 }}
              className="h-full rounded"
              style={{ background: c.color }}
            />
          </div>
        </Motion.div>
      ))}
    </div>
  )
}