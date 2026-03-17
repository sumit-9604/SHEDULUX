import { motion } from 'framer-motion'

export default function Loader({ text = 'PROCESSING' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-2 border-transparent border-t-cyan"
        />
        <div className="absolute inset-4 rounded-full bg-accent/10 border border-accent/30" />
      </div>
      <span className="font-hud text-[10px] tracking-[3px] text-accent animate-pulse">
        {text}
      </span>
    </div>
  )
}