import { motion, AnimatePresence } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function CPUCore() {
  const { result, frame } = useSimulationStore()
  const timeline = result?.timeline || []
  const current = timeline.find(b => b.start <= frame && b.end > frame)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-hud text-[8px] tracking-[2px] text-gray-600">CORE 0</div>

      <div className="relative w-24 h-24">
        {/* Outer spinning ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full"
          style={{
            border: `1.5px solid transparent`,
            borderTopColor: current ? current.color : 'rgba(124,92,255,0.3)',
            boxShadow: current ? `0 0 15px ${current.color}40` : 'none'
          }}
        />

        {/* Inner counter ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full"
          style={{
            border: `1px solid transparent`,
            borderTopColor: current ? `${current.color}80` : 'rgba(0,229,176,0.2)',
          }}
        />

        {/* Core body */}
        <motion.div
          animate={current ? { boxShadow: [`0 0 10px ${current.color}30`, `0 0 25px ${current.color}60`, `0 0 10px ${current.color}30`] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-4 rounded-xl flex flex-col items-center justify-center gap-1"
          style={{
            background: current ? `rgba(${hexToRGB(current.color)},0.1)` : 'rgba(13,13,43,0.9)',
            border: `1px solid ${current ? current.color + '40' : 'rgba(100,80,255,0.2)'}`
          }}
        >
          <span className="font-hud text-[7px] text-gray-600 tracking-[1px]">CORE</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={current?.pid || 'idle'}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="font-hud text-[13px] font-black"
              style={{ color: current ? current.color : '#3a3a5a', textShadow: current ? `0 0 10px ${current.color}` : 'none' }}
            >
              {current ? current.name : 'IDLE'}
            </motion.span>
          </AnimatePresence>
          {current && (
            <span className="font-mono text-[8px] text-gray-600">
              rem {Math.max(0, Math.ceil(current.end - frame))}
            </span>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function hexToRGB(hex) {
  return `${parseInt(hex.slice(1,3),16)},${parseInt(hex.slice(3,5),16)},${parseInt(hex.slice(5,7),16)}`
}