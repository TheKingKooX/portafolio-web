// Empaqueta tools/botones.src.js → hero/botones.js (minificado, sin dependencias en el navegador).
// Necesita esbuild y framer-motion: usa los de Buzzinez/chaska-web (o define NODE_PATH a otra carpeta node_modules).
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const aquí = dirname(fileURLToPath(import.meta.url))
const base = process.env.MOTION_BASE ?? join(aquí, '../../../Buzzinez/chaska-web/')
const { build } = createRequire(base)('esbuild')
await build({ entryPoints: [join(aquí, 'botones.src.js')], outfile: join(aquí, '../hero/botones.js'), bundle: true, minify: true, format: 'iife', target: 'es2019', nodePaths: [join(base, 'node_modules')] })
console.log('hero/botones.js listo')
