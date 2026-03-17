import { create } from 'zustand'

let nextId = 1

const useSimulationStore = create((set, get) => ({
  // processes
  processes: [],
  addProcess: (p) => set(s => ({
    processes: [...s.processes, {
      ...p,
      id: nextId++,
      name: 'P' + nextId
    }]
  })),
  removeProcess: (id) => set(s => ({
    processes: s.processes.filter(p => p.id !== id)
  })),
  clearProcesses: () => set({ processes: [] }),

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
  setFrame: (f) => set({ frame: f }),
  playing: false,
  setPlaying: (p) => set({ playing: p }),
  speed: 1,
  setSpeed: (s) => set({ speed: s }),

  // loading / error
  loading: false,
  setLoading: (l) => set({ loading: l }),
  error: null,
  setError: (e) => set({ error: e }),
}))

export default useSimulationStore