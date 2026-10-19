// Movimiento de los botones con Framer Motion (API sin React: framer-motion/dom). Se empaqueta a hero/botones.js
// con tools/construir-botones.mjs. Con «reducir movimiento» no hace nada y los botones quedan estáticos.
import { animate } from 'framer-motion/dom'

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const muelle = { type: 'spring', stiffness: 420, damping: 24, mass: .6 }
  const fino = matchMedia('(hover: hover) and (pointer: fine)').matches

  document.querySelectorAll('.cta, .boton').forEach((el) => {
    const a = (props, opts = muelle) => animate(el, props, opts)
    if (fino) {
      el.addEventListener('pointerenter', () => a({ scale: 1.04, y: -2 }))
      el.addEventListener('pointermove', (e) => {          // el botón se inclina un poco hacia el cursor
        const r = el.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height
        a({ x: dx * 8, y: -2 + dy * 6, scale: 1.04 }, { type: 'spring', stiffness: 300, damping: 22 })
      })
      el.addEventListener('pointerleave', () => a({ x: 0, y: 0, scale: 1 }))
    }
    el.addEventListener('pointerdown', () => a({ scale: .96, x: 2, y: 2 }, { type: 'spring', stiffness: 700, damping: 30 }))
    const suelta = () => a({ scale: fino && el.matches(':hover') ? 1.04 : 1, x: 0, y: fino && el.matches(':hover') ? -2 : 0 })
    el.addEventListener('pointerup', suelta); el.addEventListener('pointercancel', suelta)
  })

  // Entrada escalonada de los botones del inicio (suave, sin esperar al scroll).
  const inicio = document.querySelectorAll('.hero .botones .cta, header .cta')
  inicio.forEach((el, i) => animate(el, { opacity: [0, 1], y: [14, 0] }, { delay: .25 + i * .1, type: 'spring', stiffness: 260, damping: 22 }))
}
