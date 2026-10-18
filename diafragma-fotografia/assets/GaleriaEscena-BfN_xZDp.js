import{o as e,r as t,t as n}from"./jsx-runtime-Dt7n5OEe.js";import{d as r,g as i,p as a}from"./config-xzZBF1x6.js";import{n as o,r as s,t as c}from"./scroll-BQF_hnI4.js";import{a as l,i as u,n as d,o as f,r as p,s as m,t as h}from"./fotografia-9PkBldSO.js";import{_ as g,a as _,s as v,t as y}from"./react-three-fiber.esm-Bn4ZvWNk.js";import{t as b}from"./Texture-CVAd0xjR.js";import{t as x}from"./Senales-DrGzUvJ4.js";import{t as S}from"./Ritmo-BFfOB7HD.js";var C=e(t(),1),w=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,T=`
uniform sampler2D uFoto;
uniform float uDesenfoque;   // 0 = nítida, 1 = máximo
uniform float uOpacidad;     // se desvanece al atravesarla y a lo lejos
varying vec2 vUv;
void main() {
  vec3 c = texture2D(uFoto, vUv, uDesenfoque * 2.8).rgb;
  gl_FragColor = vec4(c, uOpacidad);
}`,E=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,D=`
uniform vec3 uA;
uniform vec3 uB;
uniform vec3 uC;
uniform float uTiempo;     // avanza más deprisa cuanto más rápido es el scroll
uniform float uAspecto;
varying vec2 vUv;
float mancha(vec2 p, vec2 c, float r) { vec2 d = p - c; return exp(-dot(d, d) / (r * r)); }
float grano(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 p = vec2(vUv.x * uAspecto, vUv.y);
  float t = uTiempo;
  float a = mancha(p, vec2((0.22 + 0.08 * sin(t * 0.21)) * uAspecto, 0.3 + 0.1 * cos(t * 0.17)), 0.55);
  float b = mancha(p, vec2((0.8 + 0.07 * cos(t * 0.19)) * uAspecto, 0.7 + 0.1 * sin(t * 0.23)), 0.5);
  float c = mancha(p, vec2((0.55 + 0.12 * sin(t * 0.13 + 2.0)) * uAspecto, 0.15 + 0.08 * sin(t * 0.29)), 0.4);
  vec3 col = (uA * (0.6 + a) + uB * b + uC * c * 0.8) / (0.6 + a + b + c * 0.8);
  col += (grano(vUv * 731.0 + fract(t)) - 0.5) * 0.02;   // grano de película
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`,O=n(),k=55,A=.5,j=.045,M=6,N=.18,P=e=>{let t=e.tipo===`foto`?l[e.foto].paleta:m.find(t=>t.nombre===e.sala).fotos[0].paleta,n=h(t);return[n,...t.filter(e=>e!==n)]};function F({textura:e,info:t,enfoque:n}){let r=(0,C.useRef)(null),i=(0,C.useMemo)(()=>({uFoto:{value:e},uDesenfoque:{value:1},uOpacidad:{value:0}}),[e]);return _(({camera:e})=>{let i=r.current.uniforms,o=e.position.z-t.z;i.uOpacidad.value=a((o-.3)/.7,0,1)*(1-a((o-11)/10,0,1)),i.uDesenfoque.value=u(o,n,M)}),(0,O.jsxs)(`mesh`,{position:[0,0,t.z],children:[(0,O.jsx)(`planeGeometry`,{args:[t.ancho,1]}),(0,O.jsx)(`shaderMaterial`,{ref:r,vertexShader:w,fragmentShader:T,uniforms:i,transparent:!0,depthWrite:!1})]})}function I({seccion:e,onProgreso:t}){let n=r()===`claro`,{size:a}=v(),u=a.width/Math.max(1,a.height),h=(0,C.useMemo)(()=>p(m,{fov:k,aspecto:u}),[u]),y=(0,C.useMemo)(()=>h.hitos.map(e=>e.z),[h]),x=(0,C.useMemo)(()=>h.hitos.filter(e=>e.tipo===`foto`).map(e=>e.z-h.fotos[e.foto].z),[h]),S=(0,C.useMemo)(()=>h.hitos.map(e=>P(e).map(e=>new g(d(e,n)))),[h,n]),w=(0,C.useRef)(null),T=(0,C.useRef)({p:0,tiempo:0}),M=(0,C.useMemo)(()=>({uA:{value:new g},uB:{value:new g},uC:{value:new g},uTiempo:{value:0},uAspecto:{value:1}}),[]),I=b(l.map(e=>f(e.foto)));return _(({camera:n,pointer:r},a)=>{let l=T.current,d=w.current.uniforms,f=l.p;l.p=i(l.p,s(e.current.getBoundingClientRect(),innerHeight),j);let p=o(l.p,y.length,A);n.position.set(i(n.position.x,r.x*N,.05),i(n.position.y,r.y*N*.6,.05),c(p,y)),n.lookAt(0,0,n.position.z-10);let m=p*(y.length-1),h=Math.min(Math.floor(m),y.length-2),g=m-h;[d.uA,d.uB,d.uC].forEach((e,t)=>e.value.lerpColors(S[h][t],S[h+1][t],g)),l.tiempo+=a*(1+Math.min(Math.abs(l.p-f)*4e3,6)),d.uTiempo.value=l.tiempo,d.uAspecto.value=u,t?.(p)}),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsxs)(`mesh`,{frustumCulled:!1,renderOrder:-1,children:[(0,O.jsx)(`planeGeometry`,{args:[2,2]}),(0,O.jsx)(`shaderMaterial`,{ref:w,vertexShader:E,fragmentShader:D,uniforms:M,depthWrite:!1})]}),l.map((e,t)=>(0,O.jsx)(F,{textura:I[t],info:h.fotos[t],enfoque:x[t]},t))]})}function L({seccion:e,activo:t,onProgreso:n,onAbrir:r,onListo:i,onPerdido:a}){return(0,O.jsxs)(y,{className:`galeria-lienzo`,"aria-hidden":`true`,dpr:[1,1.5],camera:{fov:k,near:.1,far:40,position:[0,0,5]},frameloop:`demand`,gl:{antialias:!0,powerPreference:`high-performance`},onClick:r,children:[(0,O.jsx)(S,{activo:t}),(0,O.jsx)(x,{onListo:i,onPerdido:a}),(0,O.jsx)(I,{seccion:e,onProgreso:n})]})}export{L as default};