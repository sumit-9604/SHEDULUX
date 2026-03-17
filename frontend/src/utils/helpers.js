export const COLORS = [
  '#7c5cff','#00e5b0','#ff4daa','#ffb400',
  '#ff4466','#48e0ff','#a8ff3e','#ff8c42',
  '#c77dff','#00d4ff'
]

export const ALGORITHMS = [
  { key: 'FCFS',          label: 'FCFS',         desc: 'First Come First Serve' },
  { key: 'SJF',           label: 'SJF',          desc: 'Shortest Job First' },
  { key: 'SRTF',          label: 'SRTF',         desc: 'Shortest Remaining Time' },
  { key: 'Prioritynp',    label: 'Priority',     desc: 'Non-Preemptive Priority' },
  { key: 'Priorityp',     label: 'Priority-P',   desc: 'Preemptive Priority' },
  { key: 'RoundRobin',    label: 'Round Robin',  desc: 'Time Quantum Scheduling' },
  { key: 'MultilevelQueue', label: 'MLQ',        desc: 'Multi-Level Queue' },
  { key: 'MLFQ',          label: 'MLFQ',         desc: 'Multi-Level Feedback Queue' },
]

export function hexToRGB(hex) {
  const r = parseInt(hex.slice(1,3), 16)
  const g = parseInt(hex.slice(3,5), 16)
  const b = parseInt(hex.slice(5,7), 16)
  return `${r},${g},${b}`
}

export function formatNum(n) {
  return parseFloat(n).toFixed(2)
}

export function seedProcesses() {
  return [
    { id: 1, name: 'P1', at: 0, bt: 5, pr: 3 },
    { id: 2, name: 'P2', at: 1, bt: 3, pr: 1 },
    { id: 3, name: 'P3', at: 2, bt: 8, pr: 2 },
    { id: 4, name: 'P4', at: 3, bt: 2, pr: 4 },
    { id: 5, name: 'P5', at: 4, bt: 4, pr: 2 },
  ]
}