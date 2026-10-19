    // Puente mínimo que el motor del logo espera (lo mismo que hace thebrosv/js/hero/hero-boot.js).
    window.Lab = { hero: (() => {
      const st = document.getElementById('hero-stage'), mark = (a, v) => st.setAttribute(a, v)
      let seen = false, api = null
      try { seen = localStorage.getItem('portafolio:intro') === '1' } catch {}
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const baja = innerWidth < 768 || (navigator.hardwareConcurrency || 8) <= 4 || matchMedia('(pointer: coarse)').matches
      const h = { config: { q: baja ? 'baja' : 'media', fps: 30, intro: 0, skipIntro: reduced || seen || baja },
        fail: () => { mark('data-hero', 'poster'); mark('data-intro', 'done') },
        ready: (a) => { api = a; mark('data-hero', 'live') },
        introStarted: () => mark('data-intro', 'playing'),
        introDone: () => { try { localStorage.setItem('portafolio:intro', '1') } catch {} mark('data-intro', 'done') } }
      document.getElementById('saltar').addEventListener('click', () => api && api.skip())
      new IntersectionObserver(([e]) => api && api.setActive(e.isIntersecting)).observe(st)
      return h
    })() }
