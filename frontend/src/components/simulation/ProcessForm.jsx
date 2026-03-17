import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSimulationStore from '../../stores/simulationStore'

export default function ProcessForm() {
  const { processes, addProcess, removeProcess, clearProcesses } = useSimulationStore()
  const [form, setForm] = useState({ at: 0, bt: 4, pr: 1 })

  function handleAdd() {
    if (form.bt < 1) return
    addProcess({ at: +form.at, bt: +form.bt, pr: +form.pr })
    setForm(f => ({ ...f, at: +f.at + +f.bt }))
  }

  return (
    <div>
      <div className="font-hud text-[9px] tracking-[3px] text-gray-500 mb-3 flex items-center gap-2">
        <span className="block w-3 h-px bg-cyan" />
        ADD PROCESS
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2">
        {[['ARRIVAL', 'at', 0], ['BURST', 'bt', 1], ['PRIORITY', 'pr', 1]].map(([label, key, min]) => (
          <div key={key}>
            <label className="font-mono text-[8px] text-gray-600 tracking-[1px] block mb-1">{label}</label>
            <input
              type="number" min={min}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              className="w-full bg-surface border border-white/5 text-white font-mono text-[12px] px-2 py-1.5 rounded focus:border-accent focus:outline-none transition-colors"
            />
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd}
        className="w-full border border-cyan/50 text-cyan font-hud text-[9px] tracking-[2px] py-2 rounded hover:bg-cyan/10 transition-all"
      >
        + INJECT PROCESS
      </motion.button>

      <div className="mt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="font-hud text-[9px] tracking-[2px] text-gray-500">
            QUEUE <span className="text-accent">{processes.length}</span>
          </span>
          {processes.length > 0 && (
            <button onClick={clearProcesses} className="font-mono text-[9px] text-danger/50 hover:text-danger transition-colors">
              CLEAR ALL
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          <AnimatePresence>
            {processes.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-surface/50 border border-white/5 rounded px-2 py-1.5 group"
                style={{ borderLeftColor: `hsl(${i * 37}, 70%, 60%)`, borderLeftWidth: 2 }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: `hsl(${i * 37}, 70%, 60%)`, boxShadow: `0 0 6px hsl(${i * 37}, 70%, 60%)` }} />
                <span className="font-hud text-[10px] font-bold flex-shrink-0"
                  style={{ color: `hsl(${i * 37}, 70%, 60%)` }}>{p.name || 'P' + p.id}</span>
                <span className="font-mono text-[9px] text-gray-500 flex-1">
                  A:{p.at} B:{p.bt} P:{p.pr}
                </span>
                <button onClick={() => removeProcess(p.id)}
                  className="text-danger/30 hover:text-danger text-sm opacity-0 group-hover:opacity-100 transition-all">×</button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}