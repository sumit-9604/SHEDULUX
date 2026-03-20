import { motion as Motion } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'
import { ALGORITHMS } from '../../utils/helpers'

export default function AlgorithmSelector() {
  const { algorithm, setAlgorithm, quantum, setQuantum } = useSimulationStore()

  return (
    <div>
      <div className="font-hud text-[9px] tracking-[3px] text-gray-500 mb-3 flex items-center gap-2">
        <span className="block w-3 h-px bg-accent" />
        ALGORITHM
      </div>
      <div className="grid grid-cols-2 gap-2">
        {ALGORITHMS.map(a => (
          <Motion.button
            key={a.key}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setAlgorithm(a.key)}
            className={`relative px-2 py-2 rounded border font-hud text-[8px] tracking-[1px] transition-all duration-200 overflow-hidden ${
              algorithm === a.key
                ? 'border-accent text-white bg-accent/15'
                : 'border-white/5 text-gray-500 hover:border-accent/40 hover:text-accent'
            }`}
          >
            {algorithm === a.key && (
              <Motion.div
                layoutId="algoActive"
                className="absolute inset-0 bg-accent/10"
              />
            )}
            <span className="relative z-10">{a.label}</span>
          </Motion.button>
        ))}
      </div>

      {(algorithm === 'RoundRobin' || algorithm === 'MLFQ') && (
        <Motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-3 flex items-center gap-3"
        >
          <span className="font-mono text-[10px] text-gray-500 whitespace-nowrap">QUANTUM</span>
          <input
            type="range" min="1" max="10" value={quantum}
            onChange={e => setQuantum(+e.target.value)}
            className="flex-1 accent-violet-500"
          />
          <span className="font-hud text-[11px] text-accent min-w-[16px]">{quantum}</span>
        </Motion.div>
      )}
    </div>
  )
}