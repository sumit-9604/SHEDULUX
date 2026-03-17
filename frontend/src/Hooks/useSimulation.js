import { useCallback } from 'react'
import useSimulationStore from '../stores/simulationStore'
import { runSchedule } from '../services/api'

export default function useSimulation() {
  const {
    processes, algorithm, quantum,
    setResult, setLoading, setError,
    setFrame, setPlaying, result
  } = useSimulationStore()

  const run = useCallback(async () => {
    console.log('RUN CALLED', { processes, algorithm, quantum })
    if (!processes.length) {
      setError('Add at least one process!')
      return
    }
    setLoading(true)
    setError(null)
    setFrame(0)
    setPlaying(false)
    try {
        console.log('CALLING API...')
      const data = await runSchedule(algorithm, processes, quantum)
      console.log('API RESULT:', data)
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Engine failed')
    } finally {
      setLoading(false)
    }
  }, [processes, algorithm, quantum])

  return { run, result }
}