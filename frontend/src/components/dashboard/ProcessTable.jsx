import { motion } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function ProcessTable() {
  const { result } = useSimulationStore()
  if (!result) return null

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-mono text-[11px]">
        <thead>
          <tr className="border-b border-white/5">
            {['Process','Arrival','Burst','Priority','Start','Finish','Wait','TAT'].map(h => (
              <th key={h} className="text-left py-2 px-3 font-hud text-[8px] tracking-[1.5px] text-gray-600">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.processes.map((p, i) => (
            <motion.tr
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-white/3 hover:bg-white/2 transition-colors"
            >
              <td className="py-2 px-3 font-hud text-[10px] font-bold" style={{ color: p.color }}>{p.name}</td>
              <td className="py-2 px-3 text-gray-400">{p.at}</td>
              <td className="py-2 px-3 text-gray-400">{p.bt}</td>
              <td className="py-2 px-3 text-gray-400">{p.pr}</td>
              <td className="py-2 px-3 text-accent">{p.start}</td>
              <td className="py-2 px-3 text-cyan">{p.finish}</td>
              <td className="py-2 px-3 text-amber">{p.wt}</td>
              <td className="py-2 px-3 text-pink">{p.tat}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}