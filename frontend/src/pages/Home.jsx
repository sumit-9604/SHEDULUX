import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {motion as Motion ,AnimatePresence} from 'framer-motion'
export default function Home() {
  const bgRef = useRef(null)
  const logoRef = useRef(null)
  const navigate = useNavigate()
  const [powered, setPowered] = useState(false)
  const [charged, setCharged] = useState(false)
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 })
  const S = useRef({ 
    powered: false, 
    charge: 0, 
    traces: [], 
    circuitTraces: [],
    sparks: [], 
    frame: 0
  })

  // ── Background particles ───────────────────────────────────────────────
  useEffect(() => {
    const c = bgRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    let id, pts = []

    function resize() {
      c.width = window.innerWidth
      c.height = window.innerHeight
      pts = Array.from({length:50}, () => ({
        x:Math.random()*c.width, y:Math.random()*c.height,
        vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
        r:Math.random()*1+.3, o:Math.random()*.15+.04
      }))
    }

    function loop() {
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,c.width,c.height)
      for(const p of pts) {
        p.x+=p.vx; p.y+=p.vy
        if(p.x<0)p.x=c.width; if(p.x>c.width)p.x=0
        if(p.y<0)p.y=c.height; if(p.y>c.height)p.y=0
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2)
        ctx.fillStyle=`rgba(180,180,255,${p.o})`; ctx.fill()
      }
      id = requestAnimationFrame(loop)
    }

    resize(); loop()
    window.addEventListener('resize',resize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize',resize) }
  }, [])



  // ── Logo electric canvas ───────────────────────────────────────────────
  useEffect(() => {
    const c = logoRef.current
    if (!c) return
    const ctx = c.getContext('2d')
    const CX=180, CY=180
    let id

    function makeTrace(pts, delay) {
      return { pts, delay, progress:0, speed:.018+Math.random()*.012, active:false, lit:false }
    }

    S.current.traces = [
      makeTrace([{x:CX+28,y:CY-28},{x:CX+55,y:CY-55},{x:CX+75,y:CY-55},{x:CX+90,y:CY-40},{x:CX+110,y:CY-40},{x:CX+118,y:CY-48}],0),
      makeTrace([{x:CX+28,y:CY-28},{x:CX+55,y:CY-55},{x:CX+55,y:CY-75},{x:CX+42,y:CY-88},{x:CX+42,y:CY-108},{x:CX+50,y:CY-116}],80),
      makeTrace([{x:CX+22,y:CY-22},{x:CX+45,y:CY-45},{x:CX+62,y:CY-45},{x:CX+72,y:CY-55},{x:CX+72,y:CY-70}],160),
      makeTrace([{x:CX-28,y:CY-28},{x:CX-55,y:CY-55},{x:CX-75,y:CY-55},{x:CX-90,y:CY-40},{x:CX-110,y:CY-40},{x:CX-118,y:CY-48}],40),
      makeTrace([{x:CX-28,y:CY-28},{x:CX-55,y:CY-55},{x:CX-55,y:CY-75},{x:CX-42,y:CY-88},{x:CX-42,y:CY-108},{x:CX-50,y:CY-116}],120),
      makeTrace([{x:CX-22,y:CY-22},{x:CX-45,y:CY-45},{x:CX-62,y:CY-45},{x:CX-72,y:CY-55},{x:CX-72,y:CY-70}],200),
      makeTrace([{x:CX+28,y:CY+28},{x:CX+55,y:CY+55},{x:CX+75,y:CY+55},{x:CX+90,y:CY+40},{x:CX+110,y:CY+40},{x:CX+118,y:CY+48}],60),
      makeTrace([{x:CX+28,y:CY+28},{x:CX+55,y:CY+55},{x:CX+55,y:CY+75},{x:CX+42,y:CY+88},{x:CX+42,y:CY+108},{x:CX+50,y:CY+116}],140),
      makeTrace([{x:CX+22,y:CY+22},{x:CX+45,y:CY+45},{x:CX+62,y:CY+45},{x:CX+72,y:CY+55},{x:CX+72,y:CY+70}],220),
      makeTrace([{x:CX-28,y:CY+28},{x:CX-55,y:CY+55},{x:CX-75,y:CY+55},{x:CX-90,y:CY+40},{x:CX-110,y:CY+40},{x:CX-118,y:CY+48}],20),
      makeTrace([{x:CX-28,y:CY+28},{x:CX-55,y:CY+55},{x:CX-55,y:CY+75},{x:CX-42,y:CY+88},{x:CX-42,y:CY+108},{x:CX-50,y:CY+116}],100),
      makeTrace([{x:CX-22,y:CY+22},{x:CX-45,y:CY+45},{x:CX-62,y:CY+45},{x:CX-72,y:CY+55},{x:CX-72,y:CY+70}],180),
    ]

    const NODES=[
      {x:CX+118,y:CY-48},{x:CX+50,y:CY-116},{x:CX+72,y:CY-70},
      {x:CX-118,y:CY-48},{x:CX-50,y:CY-116},{x:CX-72,y:CY-70},
      {x:CX+118,y:CY+48},{x:CX+50,y:CY+116},{x:CX+72,y:CY+70},
      {x:CX-118,y:CY+48},{x:CX-50,y:CY+116},{x:CX-72,y:CY+70},
    ]

    function tLen(pts){let l=0;for(let i=1;i<pts.length;i++){const dx=pts[i].x-pts[i-1].x,dy=pts[i].y-pts[i-1].y;l+=Math.sqrt(dx*dx+dy*dy);}return l;}
    function ptAt(pts,prog){const total=tLen(pts);let t=prog*total,l=0;for(let i=1;i<pts.length;i++){const dx=pts[i].x-pts[i-1].x,dy=pts[i].y-pts[i-1].y,seg=Math.sqrt(dx*dx+dy*dy);if(l+seg>=t){const r=(t-l)/seg;return{x:pts[i-1].x+dx*r,y:pts[i-1].y+dy*r};}l+=seg;}return pts[pts.length-1];}
    function spawnSpark(x,y){for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2,sp=Math.random()*4+1.5;S.current.sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,decay:.04+Math.random()*.03,size:Math.random()*2+.5});}}

    function loop() {
      S.current.frame++
      const g = S.current.charge
      if(S.current.powered) S.current.charge = Math.min(1, S.current.charge + 0.005)

      ctx.clearRect(0,0,360,360)

      const wa = 0.08 + g*0.12
      ctx.strokeStyle=`rgba(255,255,255,${wa})`; ctx.lineWidth=1.5
      ctx.fillStyle=`rgba(255,255,255,${wa*.25})`
      ;[[1,1],[-1,1],[1,-1],[-1,-1]].forEach(([sx,sy])=>{
        ctx.beginPath()
        ctx.moveTo(CX+sx*40,CY+sy*28); ctx.lineTo(CX+sx*68,CY+sy*28)
        ctx.lineTo(CX+sx*80,CY+sy*40); ctx.lineTo(CX+sx*80,CY+sy*60)
        ctx.lineTo(CX+sx*68,CY+sy*72); ctx.lineTo(CX+sx*40,CY+sy*72)
        ctx.lineTo(CX+sx*28,CY+sy*60); ctx.lineTo(CX+sx*28,CY+sy*40)
        ctx.closePath(); ctx.fill(); ctx.stroke()
      })

      ctx.save(); ctx.translate(CX,CY); ctx.rotate(Math.PI/4)
      ctx.fillStyle='rgba(0,0,0,0.85)'
      ctx.strokeStyle=`rgba(255,255,255,${0.2+g*.8})`
      ctx.lineWidth=2+g
      if(g>0){ctx.shadowColor='rgba(255,255,255,1)';ctx.shadowBlur=12*g}
      ctx.beginPath(); ctx.roundRect(-30,-30,60,60,4); ctx.fill(); ctx.stroke()
      ctx.restore(); ctx.shadowBlur=0

      ctx.fillStyle=`rgba(255,255,255,${0.15+g*.85})`
      if(g>0){ctx.shadowColor='rgba(255,255,255,1)';ctx.shadowBlur=g*18}
      ctx.font=`bold ${28+g*4}px Orbitron,sans-serif`
      ctx.textAlign='center'; ctx.textBaseline='middle'
      ctx.fillText('S',CX,CY+1); ctx.shadowBlur=0

      ctx.strokeStyle=`rgba(255,255,255,0.07)`; ctx.lineWidth=1
      for(const tr of S.current.traces){
        ctx.beginPath(); ctx.moveTo(tr.pts[0].x,tr.pts[0].y)
        for(let i=1;i<tr.pts.length;i++) ctx.lineTo(tr.pts[i].x,tr.pts[i].y)
        ctx.stroke()
      }

      if(S.current.powered) {
        for(const tr of S.current.traces){
          if(tr.active && tr.progress<1) tr.progress=Math.min(1,tr.progress+tr.speed)
          if(tr.progress<=0)continue
          const pts=tr.pts,total=tLen(pts);let target=tr.progress*total,l=0
          ctx.save()
          ctx.strokeStyle='rgba(255,255,255,1)'; ctx.lineWidth=1.8
          ctx.lineCap='round'; ctx.lineJoin='round'
          ctx.shadowColor='rgba(255,255,255,1)'; ctx.shadowBlur=18
          ctx.beginPath(); ctx.moveTo(pts[0].x,pts[0].y)
          for(let i=1;i<pts.length;i++){const dx=pts[i].x-pts[i-1].x,dy=pts[i].y-pts[i-1].y,seg=Math.sqrt(dx*dx+dy*dy);if(l+seg>=target){const r=(target-l)/seg;ctx.lineTo(pts[i-1].x+dx*r,pts[i-1].y+dy*r);break;}ctx.lineTo(pts[i].x,pts[i].y);l+=seg;}
          ctx.stroke()
          if(tr.progress<1){const h=ptAt(pts,tr.progress);ctx.beginPath();ctx.arc(h.x,h.y,4,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,1)';ctx.shadowBlur=28;ctx.fill();if(Math.random()<.1)spawnSpark(h.x,h.y);}
          else if(!tr.lit){tr.lit=true;const ep=tr.pts[tr.pts.length-1];spawnSpark(ep.x,ep.y);spawnSpark(ep.x,ep.y);}
          ctx.restore()
        }

        for(const n of NODES){
          if(S.current.traces.some(t=>t.lit&&t.pts[t.pts.length-1].x===n.x&&t.pts[t.pts.length-1].y===n.y)){
            ctx.save();ctx.beginPath();ctx.arc(n.x,n.y,4,0,Math.PI*2);ctx.fillStyle='rgba(255,255,255,1)';ctx.shadowColor='rgba(255,255,255,1)';ctx.shadowBlur=18;ctx.fill();ctx.restore()
          }
        }
      }

      for(let i=S.current.sparks.length-1;i>=0;i--){
        const s=S.current.sparks[i];s.x+=s.vx;s.y+=s.vy;s.vy+=.05;s.life-=s.decay
        if(s.life<=0){S.current.sparks.splice(i,1);continue}
        ctx.save();ctx.beginPath();ctx.arc(s.x,s.y,s.size*s.life,0,Math.PI*2);ctx.fillStyle=`rgba(255,255,255,${s.life})`;ctx.shadowColor='rgba(255,255,255,1)';ctx.shadowBlur=8*s.life;ctx.fill();ctx.restore()
      }

      if(g>0.7){
        const pulse=.5+.5*Math.sin(S.current.frame*.08)
        ctx.save();ctx.translate(CX,CY);ctx.rotate(Math.PI/4)
        ctx.strokeStyle=`rgba(255,255,white,${.25*pulse})`;ctx.lineWidth=1
        ctx.shadowColor='rgba(255,255,255,1)';ctx.shadowBlur=16*pulse
        ctx.beginPath();ctx.roundRect(-36,-36,72,72,5);ctx.stroke()
        ctx.restore()
      }

      if(g>0.5 && !charged) setCharged(true)
      id = requestAnimationFrame(loop)
    }

    loop()
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = logoRef.current?.getBoundingClientRect()
      if (!rect) return
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const mouseX = e.clientX - rect.left - centerX
      const mouseY = e.clientY - rect.top - centerY
      
      const rotX = (mouseY / centerY) * 8
      const rotY = (mouseX / centerX) * 8
      
      setMouseTilt({ x: rotX, y: rotY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  function handleClick() {
    if(S.current.powered) return
    S.current.powered = true
    setPowered(true)
    
    S.current.circuitTraces.forEach(tr => {
      setTimeout(() => { tr.active=true }, tr.delay + Math.random()*100)
    })
    
    S.current.traces.forEach(tr => {
      setTimeout(() => { tr.active=true }, tr.delay + Math.random()*100)
    })
  }

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden cursor-pointer select-none"
      onClick={handleClick}>
      <canvas ref={bgRef} className="absolute inset-0 z-0" />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4">
        <Motion.div
          style={{
            perspective: 1200,
            rotateX: mouseTilt.x,
            rotateY: mouseTilt.y,
          }}
          transition={{ type: 'spring', stiffness: 100, damping: 40 }}
        >
          <canvas ref={logoRef} width={360} height={360} className="block" />
        </Motion.div>

        <Motion.div
          initial={{opacity:0}} animate={{opacity: powered ? 1 : 0.15}}
          transition={{duration:1}}
          className={`font-hud text-5xl font-black tracking-[10px] transition-all duration-1000 ${
            charged ? 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.7)]' : 'text-gray-700'
          }`}
        >
          SHEDULUX
        </Motion.div>

        <div className={`font-mono text-xs tracking-[6px] transition-all duration-700 ${
          charged ? 'text-white/50' : 'text-gray-700'
        }`}>
          CPU SCHEDULING ENGINE
        </div>

        {!powered && (
          <Motion.div
            animate={{opacity:[0.3,1,0.3]}} transition={{duration:2,repeat:Infinity}}
            className="font-mono text-[11px] tracking-[3px] text-gray-600 mt-4"
          >
            [ CLICK ANYWHERE TO POWER ON ]
          </Motion.div>
        )}

        <AnimatePresence>
          {charged && (
            <Motion.div
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
              className="flex gap-4 mt-4 pointer-events-auto"
              onClick={e=>e.stopPropagation()}
            >
              <button
                onClick={()=>navigate('/simulator')}
                className="px-10 py-3 border border-white/30 text-white font-hud text-[11px] tracking-[4px] hover:bg-white/8 hover:border-white/80 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all"
              >LAUNCH SIMULATOR</button>
              <button
                onClick={()=>navigate('/compare')}
                className="px-10 py-3 border border-white/15 text-white/60 font-hud text-[11px] tracking-[4px] hover:border-white/50 hover:text-white transition-all"
              >COMPARE ALGOS</button>
            </Motion.div>
          )}
        </AnimatePresence>

        <div className="font-mono text-[9px] tracking-[2px] text-white/15 mt-2">
          POWERED BY C++ NATIVE ENGINE
        </div>
      </div>
    </div>
  )
}
