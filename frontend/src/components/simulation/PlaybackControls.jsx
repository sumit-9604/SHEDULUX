import { motion as Motion} from 'framer-motion'
import usePlayback from '../../Hooks/usePlayback'
import useSimulationStore from '../../stores/simulationStore'

const SPEEDS = [0.5, 1, 2, 4]

export default function PlaybackControls() {
  const { frame, maxT, playing, speed, seekTo, togglePlay, stepForward } = usePlayback()
  const { setSpeed } = useSimulationStore()
  const pct = maxT ? (frame / maxT) * 100 : 0
  const speedIdx = SPEEDS.indexOf(speed)

  function cycleSpeed() {
    setSpeed(SPEEDS[(speedIdx + 1) % SPEEDS.length])
  }

  function handleBarClick(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    seekTo(((e.clientX - rect.left) / rect.width) * maxT)
  }

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 glass border-t border-accent/10">
      <button onClick={() => seekTo(0)}
        className="w-7 h-7 glass-card flex items-center justify-center text-[11px] text-gray-400 hover:text-accent transition-colors rounded">
        ⏮
      </button>
      <Motion.button
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        className="w-7 h-7 glass-card flex items-center justify-center text-[11px] text-gray-400 hover:text-accent transition-colors rounded"
      >
        {playing ? '⏸' : '▶'}
      </Motion.button>
      <button onClick={stepForward}
        className="w-7 h-7 glass-card flex items-center justify-center text-[11px] text-gray-400 hover:text-accent transition-colors rounded">
        ⏭
      </button>

      <span className="font-hud text-[11px] text-accent min-w-[52px]">
        T = {Math.round(frame)}
      </span>

      <div className="flex-1 h-1 bg-white/5 rounded cursor-pointer relative" onClick={handleBarClick}>
        <Motion.div
          className="h-full bg-gradient-to-r from-accent to-cyan rounded relative"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-accent rounded-full shadow-[0_0_8px_#7c5cff]" />
        </Motion.div>
      </div>

      <button onClick={cycleSpeed}
        className="font-hud text-[9px] text-gray-500 hover:text-accent transition-colors tracking-[1px]">
        {speed}×
      </button>
    </div>
  )
}