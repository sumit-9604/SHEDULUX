import { useEffect, useRef } from 'react'
import useSimulationStore from '../stores/simulationStore'

export default function usePlayback() {
  const { frame, setFrame, playing, setPlaying, speed, result } = useSimulationStore()
  const animRef = useRef(null)
  const lastRef = useRef(null)
  const maxT = result?.stats?.maxT || 0

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(animRef.current)
      lastRef.current = null
      return
    }
    function tick(ts) {
      if (!lastRef.current) lastRef.current = ts
      const dt = (ts - lastRef.current) / 1000 * speed
      lastRef.current = ts
      setFrame(prev => {
        const next = prev + dt
        if (next >= maxT) { setPlaying(false); return maxT }
        return next
      })
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [playing, speed, maxT])

  const seekTo = (t) => setFrame(Math.max(0, Math.min(t, maxT)))
  const togglePlay = () => {
    if (frame >= maxT) seekTo(0)
    setPlaying(!playing)
  }
  const stepForward = () => {
    const blocks = result?.timeline || []
    const next = blocks.find(b => b.start > frame)
    seekTo(next ? next.start : maxT)
  }

  return { frame, maxT, playing, speed, seekTo, togglePlay, stepForward }
}