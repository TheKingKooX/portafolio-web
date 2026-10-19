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
// Tokens del sistema de diseño (design-system/tokens.json → tokens.css, generado con la skill design-system).
const tokens = readFileSync(join(RAIZ, 'design-system/tokens.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').trim()
// Partes fijas de la página (CSS y scripts del navegador) en plantilla/: se incrustan tal cual, sin cambios.
const plantilla = (f) => readFileSync(join(RAIZ, 'plantilla', f), 'utf8').replace(/\n$/, '')
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
${plantilla('fuentes.css')}
${tokens}
${plantilla('estilos.css')}
  </style>
</head>
<body>
  <a class="salto" href="#proyectos">Saltar a los proyectos</a>
  <header>
    <div class="envoltura">
      <a class="brand" href="#" aria-label="${esc(sitio.marca)}">${/^The./.test(sitio.marca) ? `The<span>${esc(sitio.marca.slice(3))}</span>` : `<span>${esc(sitio.marca)}</span>`}</a>
      <nav aria-label="Principal"><ul><li><a href="#proyectos">Proyectos</a></li><li><a href="#oferta">Qué ofrezco</a></li>${wa ? '<li><a href="#contacto">Contacto</a></li>' : ''}</ul></nav>
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
    </div>
    <section class="oferta" id="oferta" aria-labelledby="t-oferta">
      <div class="envoltura">
        <h2 id="t-oferta" class="revela">Más que una web bonita.</h2>
        <ul class="pilares">
          <li class="revela"><h3>Asesoría personalizada</h3><p>Te acompaño para que la web responda a lo que tu negocio necesita, no a una plantilla.</p></li>
          <li class="revela"><h3>Herramientas que rinden</h3><p>Sumo las que ayuden a crecer en tu área: pedidos, reservas, mensajes, lo que tu cliente use.</p></li>
          <li class="revela"><h3>Tu web como inventario</h3><p>Muestra lo que tienes disponible y deja que tus clientes lo vean al momento.</p></li>
          <li class="revela"><h3>Movimiento y 3D</h3><p>Una web que se siente distinta y que tus clientes recuerdan, como las demos de arriba.</p></li>
        </ul>
        <p class="indicio revela">¿Quieres editar tu web tú mismo? <a href="${wa || '#contacto'}"${wa ? ' target="_blank" rel="noopener"' : ''}>Pregúntame</a></p>
      </div>
    </section>${wa ? `
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
${plantilla('puente-logo.js')}
  </script>
  <script defer src="hero/three.min.js"></script>
  <script defer src="hero/gsap.min.js"></script>
  <script defer src="hero/hero.js"></script>
  <script defer src="hero/botones.js"></script>
  <script>
${plantilla('scroll-logo.js')}
  </script>
</body>
</html>
`

writeFileSync(join(RAIZ, 'index.html'), html)
console.log(`index.html: ${proyectos.length} proyecto(s): ${proyectos.map((p) => p.carpeta).join(', ')}`)

await import('./anadir-retorno.mjs')
