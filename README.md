# Portafolio web

Una carpeta por proyecto, cada una autónoma (se abre sola, sin depender de las demás). La portada `index.html` las lista
y se genera con `generar-indice.mjs`.

## Estructura

```
portafolio-web/
├─ index.html              ← portada del portafolio (generada)
├─ generar-indice.mjs      ← la genera a partir de los proyecto.json
├─ .nojekyll               ← para GitHub Pages
└─ <proyecto>/
   ├─ proyecto.json        ← datos que usa la portada
   ├─ captura.webp         ← miniatura
   └─ …                    ← la web (HTML, assets, imágenes)
```

## Añadir un proyecto (de este chat o de otro)

1. Copia su carpeta aquí. Tiene que abrirse sola: un `index.html` en la carpeta, o una subcarpeta a la que apunte `entrada`.
2. Crea `proyecto.json` dentro de la carpeta:

```json
{
  "nombre": "Nombre visible",
  "descripcion": "Una o dos frases de lo que hace.",
  "tipo": "Demo (marca ficticia)",
  "tecnologias": ["React", "Three.js"],
  "entrada": "",
  "captura": "captura.webp",
  "orden": 10
}
```

   - `entrada`: ruta dentro de la carpeta a la que lleva el enlace (`""` = el `index.html` de la carpeta; `"barberia/"` si la web está en una subcarpeta).
   - `orden`: número menor = aparece antes.
3. Ejecuta `node generar-indice.mjs` (solo hace falta Node, sin dependencias).

## Probar en local

```
python -m http.server 8780
```

y abre <http://localhost:8780/>. (Los vídeos del mundo con scroll necesitan servidor: no se ven abriendo el HTML con doble clic.)

## Publicar con GitHub Pages

En el repositorio: *Settings → Pages → Deploy from a branch → `main` / raíz*. Con el plan gratuito, el repositorio ha de ser público.
Todas las rutas son relativas, así que funcionan igual en `usuario.github.io/repositorio/`.

## Proyectos actuales

| Carpeta | Qué es |
|---|---|
| `valea-barberia/` | Barbería: una luz que sigue al cursor |
| `pulso-marketing/` | Agencia de marketing: fondos WebGL que reaccionan |
| `diafragma-fotografia/` | Estudio de fotografía: galería 3D en profundidad |
| `nacar-clinica/` | Clínica dental: partículas que dibujan figuras |
| `mundo-scroll/` | Vuelo con el scroll por maquetas de arcilla |
| `mamia-helados/` | Propuesta de web para una heladería real de Lima (demo, no oficial; no se indexa en buscadores) |

El código fuente de las cuatro primeras está en `thebrosv-lab` (se empaquetan con `node tools/empaquetar.mjs`).

## Nota sobre `mamia-helados/`

Es una **propuesta de demo para un negocio real** (Mamía Helados Artesanales), no su sitio oficial: lleva el aviso en pantalla,
`noindex, nofollow` para que los buscadores no la indexen y el WhatsApp de quien la presenta (no el del negocio). El mensaje
que rellena al pedir empieza por «¡Hola! Probé la demo web de Mamía (propuesta)…» para que no se confunda con un pedido real.

Se generó desde `Buzzinez/mamia-web` así (el código fuente de allí no se toca):
1. `npx vite build --base=./ --outDir <carpeta>` para que las rutas sean relativas.
2. En el JS compilado, las rutas `"/img/…"` pasan a `"./img/…"` y el saludo `¡Hola Mamía! Soy ` pasa a `¡Hola! Probé la demo web de Mamía (propuesta). Soy `.
3. Se añade `<meta name="robots" content="noindex, nofollow">` a su `index.html`.
Si la propuesta se acepta, se sustituye el número por el del negocio y se retira el parche del saludo.
