import { motion as Motion, AnimatePresence } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function ReadyQueue() {
  const { result, frame } = useSimulationStore()
  const timeline = result?.timeline || []
  const processes = result?.processes || []
  const current = timeline.find(b => b.start <= frame && b.end > frame)
  const ready = processes.filter(p =>
    p.at <= frame && p.finish > frame && (!current || p.id !== current.pid)
  )

  return (
    <div className="flex-1">
      <div className="font-hud text-[8px] tracking-[2px] text-gray-600 mb-2">READY QUEUE</div>
      <div className="flex gap-2 flex-wrap min-h-[36px] items-center">
        <AnimatePresence>
          {ready.length === 0 ? (
            <span className="font-mono text-[10px] text-gray-600">EMPTY</span>
          ) : (
            ready.map(p => (
              <Motion.div
                key={p.id}
                initial={{ opacity: 0, x: -15, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 15, scale: 0.8 }}
                className="px-3 py-1 rounded font-hud text-[9px] font-bold tracking-[1px] relative overflow-hidden"
                style={{
                  color: p.color,
                  border: `1px solid ${p.color}50`,
                  background: `rgba(${hexToRGB(p.color)},0.1)`
                }}
              >
                {p.name}
              </Motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function hexToRGB(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}