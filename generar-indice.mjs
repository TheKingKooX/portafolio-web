// Genera index.html (la portada del portafolio) a partir de las carpetas que traen un proyecto.json.
// Para añadir un proyecto: copia su carpeta aquí (con su proyecto.json) y ejecuta `node generar-indice.mjs`.
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const proyectos = readdirSync(RAIZ)
  .filter((c) => statSync(join(RAIZ, c)).isDirectory() && existsSync(join(RAIZ, c, 'proyecto.json')))
  .map((carpeta) => ({ carpeta, ...JSON.parse(readFileSync(join(RAIZ, carpeta, 'proyecto.json'), 'utf8')) }))
  .sort((a, b) => (a.orden ?? 99) - (b.orden ?? 99) || a.nombre.localeCompare(b.nombre, 'es'))

const tarjeta = (p) => `
      <li>
        <a class="tarjeta" href="${esc(p.carpeta)}/${esc(p.entrada ?? '')}">
          ${p.captura ? `<img src="${esc(p.carpeta)}/${esc(p.captura)}" alt="Captura de ${esc(p.nombre)}" width="800" height="500" loading="lazy">` : ''}
          <span class="cuerpo">
            <span class="tipo">${esc(p.tipo ?? 'Proyecto')}</span>
            <strong>${esc(p.nombre)}</strong>
            <span>${esc(p.descripcion ?? '')}</span>
            ${p.tecnologias?.length ? `<span class="etiquetas">${p.tecnologias.map((t) => `<em>${esc(t)}</em>`).join('')}</span>` : ''}
          </span>
        </a>
      </li>`

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portafolio web</title>
  <meta name="description" content="Webs a medida con animación, 3D y movimiento. Elige una para verla funcionando.">
  <style>
    :root { --fondo:#f6f4ef; --tinta:#16161a; --suave:#5a5750; --tarjeta:#fff; --borde:#dedad0; --acento:#5b6b00; color-scheme: light dark; }
    @media (prefers-color-scheme: dark) { :root { --fondo:#0f0f12; --tinta:#f3f1ea; --suave:#b3afa5; --tarjeta:#18181d; --borde:#2c2c33; --acento:#d7ff3a; } }
    * { box-sizing: border-box; }
    body { margin:0; background:var(--fondo); color:var(--tinta); font:16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    main { max-width:1120px; margin:0 auto; padding:56px 16px 72px; }
    h1 { font-size:clamp(2rem,5vw,3.2rem); line-height:1.1; margin:0 0 12px; letter-spacing:-.02em; }
    .intro { color:var(--suave); max-width:60ch; margin:0 0 40px; }
    ul { list-style:none; margin:0; padding:0; display:grid; gap:20px; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); }
    .tarjeta { display:flex; flex-direction:column; height:100%; background:var(--tarjeta); border:1px solid var(--borde); border-radius:14px; overflow:hidden; color:inherit; text-decoration:none; transition:transform .2s, border-color .2s; }
    .tarjeta:hover, .tarjeta:focus-visible { transform:translateY(-3px); border-color:var(--acento); }
    .tarjeta:focus-visible { outline:3px solid var(--acento); outline-offset:2px; }
    .tarjeta img { width:100%; height:auto; aspect-ratio:16/10; object-fit:cover; display:block; background:var(--borde); }
    .cuerpo { display:flex; flex-direction:column; gap:6px; padding:16px; }
    .tipo { font-size:.75rem; text-transform:uppercase; letter-spacing:.08em; color:var(--acento); font-weight:600; }
    strong { font-size:1.15rem; }
    .cuerpo > span:not(.tipo):not(.etiquetas) { color:var(--suave); font-size:.95rem; }
    .etiquetas { display:flex; flex-wrap:wrap; gap:6px; margin-top:6px; }
    .etiquetas em { font-style:normal; font-size:.75rem; padding:2px 8px; border:1px solid var(--borde); border-radius:99px; color:var(--suave); }
    footer { margin-top:48px; color:var(--suave); font-size:.85rem; }
    @media (prefers-reduced-motion: reduce) { .tarjeta { transition:none; } }
  </style>
</head>
<body>
  <main>
    <h1>Portafolio web</h1>
    <p class="intro">Webs a medida con animación, 3D y movimiento. Elige una para verla funcionando. Son demostraciones con marcas ficticias.</p>
    <ul>${proyectos.map(tarjeta).join('')}
    </ul>
    <footer>${proyectos.length} proyecto${proyectos.length === 1 ? '' : 's'}.</footer>
  </main>
</body>
</html>
`

writeFileSync(join(RAIZ, 'index.html'), html)
console.log(`index.html: ${proyectos.length} proyecto(s): ${proyectos.map((p) => p.carpeta).join(', ')}`)
