import { create } from 'zustand'

const useSimulationStore = create((set, get) => ({
  // processes
  _nextId: 1,

  addProcess: (p) => {
    const id = get()._nextId
    set(s => ({
      _nextId: s._nextId + 1,
      processes: [...s.processes, {
        ...p,
        id,
        name: 'P' + id
      }]
    }))
  },

  processes: [],

  removeProcess: (id) => set(s => ({
    processes: s.processes.filter(p => p.id !== id)
  })),

  clearProcesses: () => set({ processes: [], _nextId: 1 }), // ← resets counter

  // algorithm
  algorithm: 'FCFS',
  setAlgorithm: (a) => set({ algorithm: a }),
  quantum: 2,
  setQuantum: (q) => set({ quantum: q }),

  // simulation result
  result: null,
  setResult: (r) => set({ result: r }),
  clearResult: () => set({ result: null }),

  // playback
  frame: 0,
  setFrame: (f) => set(s => ({        // ← supports both value and function
    frame: typeof f === 'function' ? f(s.frame) : f
  })),
  playing: false,
  setPlaying: (p) => set({ playing: p }),
  speed: 1,
  setSpeed: (sp) => set({ speed: sp }), // ← renamed param to avoid shadowing set

  // loading / error
  loading: false,
  setLoading: (l) => set({ loading: l }),
  error: null,
  setError: (e) => set({ error: e }),
}))

export default useSimulationStore