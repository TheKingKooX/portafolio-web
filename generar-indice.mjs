// Genera index.html (la portada del portafolio) a partir de las carpetas que traen un proyecto.json y de portafolio.json.
// Para añadir un proyecto: copia su carpeta aquí (con su proyecto.json) y ejecuta `node generar-indice.mjs`.
// Diseño editorial/brutalista (sistema de ui-ux-pro-max): rejilla visible, bordes duros, tipografía grande y sombras planas.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const leer = (f, defecto) => (existsSync(join(RAIZ, f)) ? JSON.parse(readFileSync(join(RAIZ, f), 'utf8')) : defecto)

const sitio = { marca: 'Portafolio', subtitulo: 'Elige una demo y recórrela.', whatsapp: '', mensajeWhatsapp: '', ...leer('portafolio.json', {}) }
const proyectos = readdirSync(RAIZ)
  .filter((c) => statSync(join(RAIZ, c)).isDirectory() && existsSync(join(RAIZ, c, 'proyecto.json')))
  .map((carpeta) => ({ carpeta, ...JSON.parse(readFileSync(join(RAIZ, carpeta, 'proyecto.json'), 'utf8')) }))
  .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99) || a.nombre.localeCompare(b.nombre, 'es'))

const enlace = (p) => `${esc(p.carpeta)}/${esc(p.entrada ?? '')}`
const imagen = (p, extra = '') => (p.captura ? `<img src="${esc(p.carpeta)}/${esc(p.captura)}" alt="Captura de ${esc(p.nombre)}" width="800" height="500" ${extra}>` : '')
const etiquetas = (p) => (p.tecnologias?.length ? `<ul class="etiquetas">${p.tecnologias.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '')
const wa = sitio.whatsapp ? `https://wa.me/${esc(sitio.whatsapp)}${sitio.mensajeWhatsapp ? `?text=${encodeURIComponent(sitio.mensajeWhatsapp)}` : ''}` : ''
const pad = (n) => String(n).padStart(2, '0')

const fila = (p, i) => `
    <article class="obra" aria-labelledby="t-${i}">
      <a class="foto" href="${enlace(p)}" tabindex="-1" aria-hidden="true">${imagen(p, i < 2 ? 'fetchpriority="high"' : 'loading="lazy"')}</a>
      <div class="info">
        <p class="num">${pad(i + 1)} / ${pad(proyectos.length)} · ${esc(p.tipo ?? 'Proyecto')}</p>
        <h2 id="t-${i}">${esc(p.nombre)}</h2>
        <p class="desc">${esc(p.descripcion ?? '')}</p>
        ${etiquetas(p)}
        <a class="boton" href="${enlace(p)}">Abrir la demo <span aria-hidden="true">→</span></a>
      </div>
    </article>`

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(sitio.marca)} · Portafolio web</title>
  <meta name="description" content="${esc(sitio.subtitulo)}">
  <meta name="theme-color" content="#030a0c">
  <link rel="preload" href="hero/fonts/syne-800.woff2" as="font" type="font/woff2" crossorigin>
  <style>
    @font-face { font-family:"Syne"; font-weight:800; font-display:swap; src:url("hero/fonts/syne-800.woff2") format("woff2"); }
    @font-face { font-family:"Instrument Sans"; font-weight:400 600; font-display:swap; src:url("hero/fonts/instrument-sans.woff2") format("woff2"); }
    @font-face { font-family:"JetBrains Mono"; font-weight:400 500; font-display:swap; src:url("hero/fonts/jetbrains-mono.woff2") format("woff2"); }
    @font-face { font-family:"Caveat"; font-weight:700; font-display:block; src:url("hero/fonts/caveat-700.woff2") format("woff2"); }
    :root { --papel:#030a0c; --sup:#061216; --linea-c:#14262b; --tinta:#eff6f7; --suave:#8398a0; --cian:#22f7ff; --verde:#00f259; --naranja:#ff8000; --acento:#ff3899; --marca:linear-gradient(90deg,#22f7ff,#00f259,#ff8000,#ff3899); --linea:2px solid var(--linea-c);
      --titulo:"Syne","Arial Black",system-ui,sans-serif; --texto:"Instrument Sans",system-ui,-apple-system,"Segoe UI",sans-serif; --mono:"JetBrains Mono",ui-monospace,Consolas,monospace; color-scheme:dark; }
    * { box-sizing:border-box; margin:0; }
    html { scroll-behavior:smooth; }
    body { font:400 17px/1.55 var(--texto); background:var(--papel); color:var(--tinta); }
    a { color:inherit; } img { display:block; max-width:100%; height:auto; } ul { list-style:none; padding:0; }
    .salto { position:absolute; left:-999px; top:8px; background:var(--cian); color:#030a0c; padding:10px 16px; z-index:100; }
    .salto:focus { left:8px; }
    :focus-visible { outline:3px solid var(--cian); outline-offset:3px; }
    .envoltura { width:min(1240px, 100% - 40px); margin-inline:auto; }

    header { position:sticky; top:0; z-index:40; background:var(--papel); border-bottom:var(--linea); }
    header .envoltura { display:flex; align-items:center; justify-content:space-between; gap:16px; min-height:60px; }
    .brand { font:800 1.25rem/1 var(--titulo); letter-spacing:-.01em; color:var(--tinta); text-decoration:none; padding:12px 0; }
    .brand span { background:var(--marca); -webkit-background-clip:text; background-clip:text; color:transparent; }
    header nav ul { display:flex; gap:28px; font-weight:500; }
    header nav a { text-decoration:none; padding:10px 0; display:inline-block; border-bottom:2px solid transparent; transition:border-color .15s; }
    header nav a:hover { border-color:var(--cian); }
    .boton, .cta { display:inline-flex; align-items:center; gap:10px; min-height:48px; padding:0 22px; background:var(--cian); color:#030a0c; font:600 16px var(--texto); text-decoration:none; border:2px solid var(--cian); cursor:pointer; box-shadow:5px 5px 0 var(--acento); transition:box-shadow .2s, background .15s, color .15s; will-change:transform; }
    .boton:hover, .cta:hover { box-shadow:8px 8px 0 var(--acento); }
    .boton:active, .cta:active { box-shadow:2px 2px 0 var(--acento); }
    header .cta { min-height:44px; padding:0 16px; font-size:15px; box-shadow:none; }
    header .cta:hover { box-shadow:none; background:var(--verde); border-color:var(--verde); }

    .escenario { position:relative; isolation:isolate; height:clamp(300px,64svh,720px); background:#030a0c; border-bottom:var(--linea); overflow:hidden; }
    .escenario .poster, .escenario canvas { position:absolute; inset:0; width:100%; height:100%; display:block; }
    .escenario .poster { object-fit:cover; transition:opacity .8s; }
    .escenario canvas { opacity:0; transition:opacity .8s; }
    .escenario[data-hero="live"] canvas { opacity:1; } .escenario[data-hero="live"] .poster { opacity:0; }
    .escenario[data-hero="poster"] canvas { display:none; }
    .saltar { position:absolute; right:16px; bottom:16px; z-index:2; min-height:40px; padding:0 14px; background:rgba(3,10,12,.7); color:var(--tinta); border:1px solid var(--suave); font:500 13px var(--mono); cursor:pointer; display:none; }
    .escenario[data-intro="playing"] .saltar { display:block; }
    .hero { border-bottom:var(--linea); padding:clamp(36px,6vw,80px) 0 clamp(36px,5vw,64px); }
    .hero h1 { font:800 clamp(48px,11vw,170px)/.9 var(--titulo); letter-spacing:-.045em; text-transform:uppercase; }
    .hero h1 em { font-style:normal; background:var(--marca); -webkit-background-clip:text; background-clip:text; color:transparent; padding:0 .08em; box-decoration-break:clone; -webkit-box-decoration-break:clone; }
    .hero .fila { display:grid; grid-template-columns:1.4fr 1fr; gap:32px; margin-top:clamp(32px,5vw,64px); align-items:end; }
    .hero p.sub { font-size:clamp(19px,2vw,26px); line-height:1.3; max-width:34ch; }
    .hero .datos { display:flex; gap:12px; flex-wrap:wrap; justify-content:flex-end; }
    .hero .botones { margin-top:32px; display:flex; gap:20px; flex-wrap:wrap; }
    .cta.claro { background:transparent; color:var(--tinta); border-color:var(--tinta); box-shadow:5px 5px 0 var(--naranja); } .cta.claro:hover { box-shadow:8px 8px 0 var(--naranja); } .cta.claro:active { box-shadow:2px 2px 0 var(--naranja); }
    .dato { border:var(--linea); padding:6px 14px; font:500 13px var(--mono); text-transform:uppercase; letter-spacing:.05em; }

    #proyectos { display:grid; grid-template-columns:repeat(auto-fill,minmax(min(100%,340px),1fr)); border-bottom:var(--linea); }
    .obra { display:flex; flex-direction:column; border-right:var(--linea); border-top:var(--linea); min-width:0; }
    .obra:first-child { grid-column:1 / -1; flex-direction:row; flex-wrap:wrap; }
    .obra:first-child .foto { flex:1 1 420px; } .obra:first-child .info { flex:1 1 320px; justify-content:center; }
    .obra:nth-child(even) .num { color:var(--verde); }
    .foto { display:block; overflow:hidden; background:var(--sup); border-bottom:var(--linea); }
    .obra:first-child .foto { border-bottom:0; border-right:var(--linea); }
    .foto img { width:100%; height:auto; aspect-ratio:16/10; object-fit:contain; transition:transform .5s cubic-bezier(.22,.61,.36,1); }
    .obra:hover .foto img { transform:scale(1.03); }
    .info { min-width:0; padding:clamp(20px,3vw,40px); display:flex; flex-direction:column; flex:1; gap:12px; align-items:flex-start; }
    .num { font:500 13px var(--mono); color:var(--cian); text-transform:uppercase; letter-spacing:.08em; }
    .info h2 { overflow-wrap:anywhere; hyphens:auto; font:700 clamp(24px,2.6vw,36px)/1.05 var(--titulo); letter-spacing:-.035em; text-transform:uppercase; }
    .desc { max-width:40ch; color:var(--suave); }
    .etiquetas { display:flex; flex-wrap:wrap; gap:8px; }
    .etiquetas li { font:500 12px var(--mono); border:1px solid var(--suave); color:var(--tinta); padding:3px 10px; }
    .info .boton { margin-top:auto; }
    .obra:first-child .info h2 { font-size:clamp(28px,3.6vw,52px); } .obra:first-child .info .boton { margin-top:10px; }

    .contacto { background:var(--sup); border-bottom:var(--linea); position:relative; padding:clamp(56px,9vw,120px) 0; }
    .contacto::before { content:""; position:absolute; inset:0 0 auto 0; height:6px; background:var(--marca); }
    .contacto h2 { font:700 clamp(44px,9vw,140px)/.9 var(--titulo); letter-spacing:-.04em; text-transform:uppercase; max-width:12ch; }
    .contacto p { font-size:clamp(19px,2vw,26px); max-width:30ch; margin:24px 0 32px; line-height:1.3; }
    .contacto .cta { box-shadow:5px 5px 0 var(--verde); } .contacto .cta:hover { box-shadow:8px 8px 0 var(--verde); } .contacto .cta:active { box-shadow:2px 2px 0 var(--verde); }
    footer { padding:24px 0 32px; font-size:14px; color:var(--suave); }

    .revela { opacity:0; transform:translateY(24px); transition:opacity .5s, transform .5s; }
    .revela.visto { opacity:1; transform:none; }
    html { -webkit-tap-highlight-color:transparent; overflow-x:clip; } body { overflow-x:clip; } .hero h1 { overflow-wrap:break-word; }
    header .envoltura { padding-top:env(safe-area-inset-top); }
    @media (max-width:820px) {
      body { font-size:16px; }
      header nav { display:none; }
      header .envoltura { min-height:56px; }
      .escenario { height:clamp(260px,46svh,420px); }
      .hero { padding:28px 0 32px; }
      .hero h1 { font-size:clamp(34px,10.5vw,96px); }
      .hero .fila { margin-top:20px; gap:16px; }
      .hero .botones { margin-top:22px; flex-direction:column; gap:16px; }
      .hero .botones .cta { justify-content:center; width:100%; }
      .info { padding:20px 18px 24px; gap:10px; }
      .info h2, .obra:first-child .info h2 { font-size:clamp(26px,8vw,38px); }
      .info .boton { width:100%; justify-content:center; margin-top:8px; }
      .contacto { padding:56px 0 64px; }
      .contacto .cta { width:100%; justify-content:center; }
      .saltar { bottom:10px; right:10px; }
      .hero .fila { grid-template-columns:1fr; } .hero .datos { justify-content:flex-start; }
      .obra { border-right:0; } .obra:first-child { flex-direction:column; flex-wrap:nowrap; } .obra:first-child .foto { flex:none; border-right:0; border-bottom:var(--linea); }
    }
    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior:auto; } * { transition:none !important; }
      .revela { opacity:1; transform:none; } .obra:hover .foto img { transform:none; }
    }
  </style>
</head>
<body>
  <a class="salto" href="#proyectos">Saltar a los proyectos</a>
  <header>
    <div class="envoltura">
      <a class="brand" href="#" aria-label="${esc(sitio.marca)}">${/^The./.test(sitio.marca) ? `The<span>${esc(sitio.marca.slice(3))}</span>` : `<span>${esc(sitio.marca)}</span>`}</a>
      <nav aria-label="Principal"><ul><li><a href="#proyectos">Proyectos</a></li>${wa ? '<li><a href="#contacto">Contacto</a></li>' : ''}</ul></nav>
      ${wa ? `<a class="cta" href="${wa}" target="_blank" rel="noopener">Hablemos</a>` : ''}
    </div>
  </header>
  <main>
    <div class="escenario" id="hero-stage" data-hero="loading" data-intro="done">
      <picture><source media="(max-width: 820px)" srcset="hero/hero-poster-tall.webp"><img class="poster" src="hero/hero-poster.webp" alt="" width="1878" height="601" fetchpriority="high"></picture>
      <canvas id="hero-gl" role="img" aria-label="Logotipo de TheBrosV hecho de partículas 3D: una cara sonriente partida en dos y las palabras The Bros V. Mueve el cursor y haz clic para jugar con él."></canvas>
      <button type="button" class="saltar" id="saltar">Saltar intro</button>
    </div>
    <section class="hero" aria-labelledby="titulo">
      <div class="envoltura">
        <h1 id="titulo">Webs que <em>se sienten.</em></h1>
        <div class="fila">
          <p class="sub">${esc(sitio.subtitulo)}</p>
          <div class="datos"><span class="dato">${proyectos.length} demos</span><span class="dato">Marcas ficticias</span></div>
        </div>
        <p class="botones"><a class="cta" href="#proyectos">Ver proyectos ↓</a>${wa ? `<a class="cta claro" href="${wa}" target="_blank" rel="noopener">Escríbeme</a>` : ''}</p>
      </div>
    </section>
    <div id="proyectos">${proyectos.map(fila).join('')}
    </div>${wa ? `
    <section class="contacto" id="contacto" aria-labelledby="t-contacto">
      <div class="envoltura">
        <h2 id="t-contacto" class="revela">¿Hacemos la tuya?</h2>
        <p class="revela">Cuéntame tu negocio y te propongo una web que se recuerde.</p>
        <a class="cta revela" href="${wa}" target="_blank" rel="noopener">Escríbeme por WhatsApp →</a>
      </div>
    </section>` : ''}
  </main>
  <footer><div class="envoltura">Demostraciones con marcas ficticias. Las imágenes y los textos de cada proyecto son de ejemplo.</div></footer>
  <script>
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
  </script>
  <script defer src="hero/three.min.js"></script>
  <script defer src="hero/gsap.min.js"></script>
  <script defer src="hero/hero.js"></script>
  <script defer src="hero/botones.js"></script>
  <script>
    const io = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target) } }, { threshold: .2 })
    document.querySelectorAll('.revela').forEach((e) => io.observe(e))
  </script>
</body>
</html>
`

writeFileSync(join(RAIZ, 'index.html'), html)
console.log(`index.html: ${proyectos.length} proyecto(s): ${proyectos.map((p) => p.carpeta).join(', ')}`)

await import('./anadir-retorno.mjs')
