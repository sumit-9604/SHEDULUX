import { motion } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function GanttChart() {
  const { result, frame } = useSimulationStore()
  if (!result) return null

  const { timeline, processes } = result
  const maxT = result.stats.maxT
  const W = Math.max(600, maxT * 44)

  return (
    <div>
      <div className="font-hud text-[9px] tracking-[3px] text-gray-500 mb-3 flex items-center gap-2">
        <span className="block w-3 h-px bg-accent" />
        GANTT TIMELINE
      </div>

      <div className="overflow-x-auto pb-2">
        <div style={{ width: W + 40 }}>
          {processes.map(p => {
            const blocks = timeline.filter(b => b.pid === p.id)
            return (
              <div key={p.id} className="flex items-center gap-2 mb-1.5">
                <span className="font-hud text-[9px] w-6 text-right flex-shrink-0"
                  style={{ color: p.color }}>{p.name}</span>
                <div className="relative flex-1 h-7 bg-white/2 rounded"
                  style={{ width: W }}>
                  {blocks.map(b => {
                    const left = (b.start / maxT) * 100
                    const width = ((b.end - b.start) / maxT) * 100
                    const isDone = b.end <= frame
                    const isCurrent = b.start <= frame && b.end > frame

                    return (
                      <motion.div
                        key={b.start}
                        initial={{ opacity: 0.1 }}
                        animate={{
                          opacity: isDone ? 1 : isCurrent ? 0.85 : 0.15,
                          boxShadow: isCurrent ? `0 0 12px ${b.color}, 0 0 24px ${b.color}40` : 'none'
                        }}
                        transition={{ duration: 0.3 }}
                        className="absolute top-0.5 h-6 rounded flex items-center justify-center font-hud text-[8px] font-bold text-white cursor-pointer"
                        style={{ left: `${left}%`, width: `${width}%`, background: b.color }}
                        title={`${b.name}: T${b.start}–T${b.end}`}
                      >
                        {(b.end - b.start) > 1 ? b.name : ''}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            )
          })}

          {/* Timeline ticks */}
          <div className="relative ml-8 mt-1" style={{ width: W }}>
            {Array.from({ length: Math.min(maxT + 1, 20) }, (_, i) => {
              const t = Math.round(i * maxT / Math.min(maxT, 19))
              return (
                <span key={t} className="absolute font-mono text-[8px] text-gray-600"
                  style={{ left: `${(t / maxT) * 100}%`, transform: 'translateX(-50%)' }}>
                  {t}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}