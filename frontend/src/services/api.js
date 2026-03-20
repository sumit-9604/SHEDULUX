import axios from 'axios'

const api = axios.create({
  baseURL: 'https://shedulux.onrender.com',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})

export async function runSchedule(algorithm, processes, quantum = 2) {
  const payload = {
    algorithm,
    processes: processes.map(p => ({
      id: String(p.id),
      arrival: Number(p.at),
      burst: Number(p.bt),
      priority: Number(p.pr),
      queueLevel: Number(p.pr) - 1 < 0 ? 0 : Number(p.pr) - 1
    })),
    ...(algorithm === 'RoundRobin' && { quantum: Number(quantum) }),
    ...(algorithm === 'MLFQ' && { quantum: Number(quantum) })
  }
  const res = await api.post('/api/schedule', payload)
  return res.data
}

export async function runCompare(processes, quantum = 2) {
  const algorithms = ['FCFS', 'SJF', 'SRTF', 'Prioritynp', 'RoundRobin']
  const results = await Promise.all(
    algorithms.map(algo =>
      runSchedule(algo, processes, quantum)
        .then(data => ({ algo, ...data }))
        .catch(err => ({ algo, error: err.message }))
    )
  )
  return results
}

export default api