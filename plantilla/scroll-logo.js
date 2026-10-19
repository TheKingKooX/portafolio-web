    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target) } }, { threshold: .2 })
    document.querySelectorAll('.revela').forEach((e) => io.observe(e))

    // El logo 3D reacciona al scroll: progreso 0–1 sobre la altura del escenario, suavizado (lerp), solo transform/opacity.
    const escenario = document.getElementById('hero-stage'), lienzo = escenario.querySelector('canvas')
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      let objetivo = 0, p = 0, activo = false
      const leer = () => { if (scrollY > 0) lienzo.style.transition = 'none'; objetivo = Math.min(1, Math.max(0, scrollY / Math.max(1, escenario.offsetHeight))); if (!activo) { activo = true; requestAnimationFrame(paso) } }
      const paso = () => {
        p += (objetivo - p) * .12
        lienzo.style.transform = 'translate3d(0,' + (p * 14).toFixed(2) + '%,0) scale(' + (1 + p * .18).toFixed(3) + ')'
        escenario.style.setProperty('--vis', (1 - p * .65).toFixed(3))
        if (Math.abs(objetivo - p) > .001) requestAnimationFrame(paso); else activo = false
      }
      addEventListener('scroll', leer, { passive: true }); leer()
    }
    // Si el navegador pierde el contexto WebGL, se vuelve al póster estático en vez de dejar el escenario vacío.
    lienzo.addEventListener('webglcontextlost', (e) => { e.preventDefault(); escenario.dataset.hero = 'poster' })
