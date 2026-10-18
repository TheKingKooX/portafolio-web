import{o as e,r as t,t as n}from"./jsx-runtime-Dt7n5OEe.js";import{c as r,g as i}from"./config-xzZBF1x6.js";import{a,i as o,n as s,r as c,t as l}from"./marketing-Bkb1b2sy.js";import{a as u,s as d,t as f}from"./react-three-fiber.esm-Bn4ZvWNk.js";import{t as p}from"./Senales-DrGzUvJ4.js";import{t as m}from"./Ritmo-BFfOB7HD.js";var h=e(t(),1),g=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,_=`
uniform float uTiempo, uAspecto, uFuerza, uMezcla, uLatido, uAtraccion, uVel;
uniform vec2 uPuntero, uAtractor;          // 0..1, origen abajo a la izquierda
uniform int uModoA, uModoB;
uniform vec3 uC0, uC1, uC2;                // paleta: base, acento 1, acento 2
uniform vec3 uOndas[4];                    // (x, y, edad); edad < 0 = vacía
varying vec2 vUv;

float h(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, s = 0.5; for (int i = 0; i < 5; i++) { v += s * ruido(p); p *= 2.0; s *= 0.5; } return v; }

// Rampa de la paleta: 0 -> base, 0,5 -> acento 1, 1 -> acento 2.
vec3 rampa(float v) {
  v = clamp(v, 0.0, 1.0);
  return mix(mix(uC0, uC1, v * 2.0), mix(uC1, uC2, v * 2.0 - 1.0), step(0.5, v));
}

// 0 · Tinta líquida: ruido con el dominio deformado, en bandas como tinta en agua.
vec3 tinta(vec2 p) {
  vec2 q = vec2(fbm(p * 1.4 + uTiempo * 0.05), fbm(p * 1.4 + vec2(5.2, 1.3) - uTiempo * 0.04));
  float v = fbm(p * 1.1 + q * 2.4 + uTiempo * 0.03);
  return rampa(smoothstep(0.42, 0.58, v) * 0.55 + smoothstep(0.6, 0.72, v) * 0.45);
}

// 1 · Plasma.
vec3 plasma(vec2 p) {
  vec2 c = uPuntero * vec2(uAspecto, 1.0);
  float v = sin(p.x * 3.0 + uTiempo) + sin(p.y * 4.0 - uTiempo * 1.3) + sin((p.x + p.y) * 3.0 + uTiempo * 0.7) + sin(length(p - c) * 6.0 - uTiempo * 2.0);
  return rampa(v * 0.125 + 0.5);
}

// 2 · Ondas de datos: barras que respiran y crestas tipo dunas; el latido las enciende.
vec3 datos(vec2 p) {
  float col = floor(p.x * 18.0);
  float alto = 0.25 + 0.35 * fbm(vec2(col * 0.35, uTiempo * 0.25)) + uLatido * 0.25;
  float barra = step(fract(p.x * 18.0), 0.7) * step(vUv.y, alto);
  float cresta = 0.0;
  for (int i = 0; i < 3; i++) {
    float f = float(i);
    float y = 0.55 + f * 0.12 + 0.05 * sin(p.x * (3.0 + f) + uTiempo * (0.4 + f * 0.1));
    cresta += exp(-abs(vUv.y - y) * 60.0) * (0.6 - f * 0.15);
  }
  return rampa(barra * (0.45 + 0.4 * vUv.y / max(alto, 0.01)) + cresta * 0.8 + uLatido * 0.15);
}

// 3 · Cortinas: lamas que giran a ritmo propio y siguen al puntero.
vec3 cortinas(vec2 p) {
  float x = fract(vUv.x * 14.0), id = floor(vUv.x * 14.0);
  float giro = 0.5 + 0.5 * sin(uTiempo * 0.8 + id * 0.4 + uPuntero.x * 6.0);
  float luz = mix(0.2, 1.0, smoothstep(0.0, 1.0, x)) * mix(0.5, 1.0, giro);
  return rampa(luz * (0.55 + 0.45 * vUv.y) + pow(x, 18.0) * 0.3 * giro);
}

// 4 · Estrellas: tres capas que viajan más rápido cuando se hace scroll.
vec3 estrellas(vec2 p) {
  vec3 c = rampa(0.12 * vUv.y);
  for (int i = 0; i < 3; i++) {
    float f = float(i);
    vec2 g = gl_FragCoord.xy / (5.0 + f * 5.0) + vec2(0.0, uTiempo * (1.0 + f) * (2.0 + uVel * 40.0)) + uPuntero * 12.0 * (f + 1.0);
    vec2 id = floor(g), fr = fract(g) - 0.5;
    float s = h(id + f * 7.0);
    if (s > 0.972) {
      float tw = 0.5 + 0.5 * sin(uTiempo * 3.0 + s * 60.0);
      float estela = exp(-abs(fr.x) * 30.0) * smoothstep(0.5, -0.5, fr.y) * uVel * 6.0;   // con velocidad, las estrellas se estiran
      c = mix(c, mix(uC1, uC2, (s - 0.972) * 35.0), clamp(smoothstep(0.32, 0.0, length(fr)) * tw + estela, 0.0, 1.0) * (1.0 - f * 0.2));
    }
  }
  return c;
}

// 5 · Convergencia: espirales que se arremolinan hacia el botón de contacto.
vec3 convergencia(vec2 p) {
  vec2 d = p - uAtractor * vec2(uAspecto, 1.0);
  float r = length(d), a = atan(d.y, d.x);
  float v = sin(r * 22.0 + uTiempo * (3.0 + uAtraccion * 4.0) - a * 3.0) * 0.5 + 0.5;
  float cerca = exp(-r * (2.5 - uAtraccion));
  return rampa(v * (0.35 + 0.65 * cerca) + cerca * uAtraccion * 0.4);
}

vec3 modo(int m, vec2 p) {
  if (m == 1) return plasma(p);
  if (m == 2) return datos(p);
  if (m == 3) return cortinas(p);
  if (m == 4) return estrellas(p);
  if (m == 5) return convergencia(p);
  return tinta(p);
}

void main() {
  vec2 p = vUv * vec2(uAspecto, 1.0);

  // El puntero arremolina el espacio a su alrededor, más cuanto más rápido se mueve.
  vec2 d = p - uPuntero * vec2(uAspecto, 1.0);
  p += vec2(-d.y, d.x) * exp(-length(d) * 4.0) * uFuerza * 0.35;

  // Ondas de clic: un frente que se expande y se apaga.
  float brillo = 0.0;
  for (int i = 0; i < 4; i++) {
    vec3 o = uOndas[i];
    if (o.z < 0.0) continue;
    vec2 dd = p - o.xy * vec2(uAspecto, 1.0);
    float anillo = exp(-pow((length(dd) - o.z * 0.6) * 14.0, 2.0)) * exp(-o.z * 1.2);
    p += normalize(dd + 1e-5) * anillo * 0.06;
    brillo += anillo;
  }

  vec3 col = uMezcla < 0.001 ? modo(uModoA, p) : uMezcla > 0.999 ? modo(uModoB, p) : mix(modo(uModoA, p), modo(uModoB, p), uMezcla);
  col += uC1 * brillo * 0.3;
  col = mix(uC0, col, 0.8);   // la base domina: el contenido va encima en bloques opacos
  gl_FragColor = vec4(col, 1.0);
}`,v=n(),y=.8;function b({capitulo:e,tema:t,tinte:n,senales:f}){let p=(0,h.useRef)(null),m=r(),{size:b,clock:x}=d(),S=(0,h.useRef)(s({max:4,vida:2.5})),C=(0,h.useRef)({mezcla:{a:0,b:0,t:1},paleta:a.portada[t].map(c),fuerza:0,px:0,py:0,scroll:0,vel:0,latido:0,latidosVistos:0,atraccion:0}),w=(0,h.useMemo)(()=>({uTiempo:{value:0},uAspecto:{value:1},uFuerza:{value:0},uMezcla:{value:1},uLatido:{value:0},uAtraccion:{value:0},uVel:{value:0},uPuntero:{value:[.5,.5]},uAtractor:{value:[.5,.5]},uModoA:{value:0},uModoB:{value:0},uC0:{value:[1,1,1]},uC1:{value:[1,1,1]},uC2:{value:[1,1,1]},uOndas:{value:new Float32Array(12).fill(-1)}}),[]);return(0,h.useEffect)(()=>{let e=e=>S.current.agregar(e.clientX/innerWidth,1-e.clientY/innerHeight,x.elapsedTime);return window.addEventListener(`pointerdown`,e,{passive:!0}),()=>window.removeEventListener(`pointerdown`,e)},[x]),u((r,s)=>{let u=p.current.uniforms,d=C.current,h=m.current,g=x.elapsedTime,_=a[e];d.mezcla=l(d.mezcla,_.modo,s,y);let[v,w,T]=_[t];d.paleta=o(d.paleta,[v,n??w,T].map(c),Math.min(1,s*4));let E=Math.hypot(h.x-d.px,h.y-d.py);d.fuerza=i(d.fuerza,Math.min(1,E/30),.1),d.px=h.x,d.py=h.y,u.uTiempo.value=g,u.uAspecto.value=b.width/b.height,u.uFuerza.value=d.fuerza,u.uModoA.value=d.mezcla.a,u.uModoB.value=d.mezcla.b,u.uMezcla.value=d.mezcla.t,u.uC0.value=d.paleta[0],u.uC1.value=d.paleta[1],u.uC2.value=d.paleta[2],h.activo&&(u.uPuntero.value[0]=h.x/b.width,u.uPuntero.value[1]=1-h.y/b.height),u.uOndas.value.set(S.current.uniforme(g)),d.vel=i(d.vel,Math.min(1,Math.abs(window.scrollY-d.scroll)/Math.max(1,b.height)/Math.max(s,.001)*.05),.1),d.scroll=window.scrollY;let D=f.current;D.latidos!==d.latidosVistos&&(d.latido=1,d.latidosVistos=D.latidos),d.latido=Math.max(0,d.latido-s*1.5),d.atraccion=i(d.atraccion,D.atractor?D.atractor.fuerza:0,.08),D.atractor&&(u.uAtractor.value[0]=D.atractor.x,u.uAtractor.value[1]=D.atractor.y),u.uVel.value=d.vel,u.uLatido.value=d.latido,u.uAtraccion.value=d.atraccion}),(0,v.jsxs)(`mesh`,{children:[(0,v.jsx)(`planeGeometry`,{args:[2,2]}),(0,v.jsx)(`shaderMaterial`,{ref:p,vertexShader:g,fragmentShader:_,uniforms:w})]})}function x({capitulo:e,tema:t,tinte:n,senales:r,onListo:i,onPerdido:a}){return(0,v.jsxs)(f,{className:`fondo-vivo`,"aria-hidden":`true`,dpr:[1,1.5],frameloop:`demand`,gl:{antialias:!1,powerPreference:`high-performance`},children:[(0,v.jsx)(m,{}),(0,v.jsx)(p,{onListo:i,onPerdido:a}),(0,v.jsx)(b,{capitulo:e,tema:t,tinte:n,senales:r})]})}export{x as default};