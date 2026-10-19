// Pone en la página de entrada de cada demo un botón flotante «← Portafolio» que vuelve a la portada.
// Se ejecuta solo desde generar-indice.mjs; es idempotente (reemplaza lo anterior entre las marcas).
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const RAIZ = dirname(fileURLToPath(import.meta.url))
const readJs = (d) => (existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(d, f), 'utf8')).join('') : '')
const MARCA = /<!-- retorno-portafolio -->[\s\S]*?<!-- \/retorno-portafolio -->\n?/
const bloque = (volver) => `<!-- retorno-portafolio -->
<style>
#volver-portafolio{position:fixed;left:16px;bottom:16px;z-index:2147483647;display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 16px;border-radius:99px;background:rgba(3,10,12,.82);color:#eff6f7;border:1.5px solid #22f7ff;font:600 14px/1 system-ui,-apple-system,"Segoe UI",sans-serif;text-decoration:none;-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);box-shadow:0 4px 18px rgba(0,0,0,.4);transition:background .15s,color .15s}
#volver-portafolio:hover{background:#22f7ff;color:#030a0c}
#volver-portafolio:focus-visible{outline:3px solid #ff3899;outline-offset:3px}
</style>
<a id="volver-portafolio" href="${volver}" aria-label="Volver al portafolio">← Portafolio</a>
<!-- /retorno-portafolio -->
`

for (const c of readdirSync(RAIZ)) {
  const pj = join(RAIZ, c, 'proyecto.json')
  if (!statSync(join(RAIZ, c)).isDirectory() || !existsSync(pj)) continue
  const entrada = JSON.parse(readFileSync(pj, 'utf8')).entrada ?? ''
  const archivo = join(RAIZ, c, entrada, 'index.html')
  if (!existsSync(archivo)) { console.warn(`retorno: sin ${relative(RAIZ, archivo)}`); continue }
  const volver = '../'.repeat(relative(RAIZ, dirname(archivo)).split(sep).length)
  let html = readFileSync(archivo, 'utf8').replace(MARCA, '')
  // Las demos del lab ya llevan su propio «← TheBrosV» (sello-volver) apuntando a la portada: no se duplica.
  if (/sello-volver/.test(html) || /sello-volver/.test(readJs(join(dirname(archivo), 'assets')))) { writeFileSync(archivo, html); console.log(`retorno: ${c} ya tiene botón propio`); continue }
  if (!/<\/body>/i.test(html)) { console.warn(`retorno: ${c} sin </body>`); continue }
  html = html.replace(/<\/body>/i, () => bloque(volver) + '</body>')
  writeFileSync(archivo, html)
  console.log(`retorno: ${relative(RAIZ, archivo)} → ${volver}`)
}
