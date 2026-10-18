import{o as e,r as t,t as n}from"./jsx-runtime-Dt7n5OEe.js";import{_ as r,f as i,m as a}from"./config-BgSAy3kI.js";import{n as o,r as s}from"./scroll-5YT-ypsN.js";import{a as c,i as l,n as u,o as d,r as f,t as p}from"./restaurante-C8vNgz0C.js";import{_ as m,a as h,s as g,t as _}from"./react-three-fiber.esm-Bn4ZvWNk.js";import{n as v,r as y,t as b}from"./escenaPlato-D7RAcvPC.js";import{t as x}from"./Senales-DrGzUvJ4.js";import{t as S}from"./Ritmo--oUenmsJ.js";var C=e(t(),1),w=`
uniform float uTiempo;
uniform float uVelocidad;
uniform float uAlto;
attribute float aSemilla;
varying float vVida;
void main() {
  vec3 p = position;
  float subida = uTiempo * (0.25 + 0.35 * aSemilla) * (1.0 + 2.5 * uVelocidad);
  float y = mod(p.y + subida, uAlto);
  vVida = 1.0 - y / uAlto;                          // 1 al nacer abajo, 0 arriba
  p.y = y - uAlto * 0.5;
  p.x += sin(uTiempo * 0.8 + aSemilla * 40.0) * 0.15 * (1.0 - vVida);
  vec4 vista = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = (2.0 + 4.0 * aSemilla) * (5.0 / -vista.z);
  gl_Position = projectionMatrix * vista;
}`,T=`
uniform vec3 uColor;
uniform float uIntensidad;
varying float vVida;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d) * smoothstep(0.0, 0.35, vVida) * uIntensidad;
  gl_FragColor = vec4(uColor * (0.6 + vVida), a);
}`,E=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,D=`
uniform float uTiempo;
uniform float uSemilla;
uniform vec3 uColor;
uniform float uIntensidad;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float ruido(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * ruido(p); p *= 2.03; a *= 0.5; } return v; }
void main() {
  vec2 p = vUv * vec2(2.0, 3.0) + vec2(uSemilla, -uTiempo * 0.06);
  float n = fbm(p + ruido(p * 0.5 + uTiempo * 0.03) * 0.8);   // remolino barato: un ruido en vez de otro fbm
  float borde = smoothstep(0.0, 0.3, vUv.x) * smoothstep(1.0, 0.7, vUv.x) * smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
  gl_FragColor = vec4(uColor, smoothstep(0.45, 0.85, n) * borde * uIntensidad);
}`,O=n(),k=260,A=4.5,j={oscuro:{brasa:`#ff8a3d`,brasaIntensidad:.9,humo:`#8c766a`,humoIntensidad:.32},claro:{brasa:`#c2410c`,brasaIntensidad:.55,humo:`#9c8b80`,humoIntensidad:.16}};function M({estado:e,tema:t}){let n=(0,C.useRef)(null),[r,i]=(0,C.useMemo)(()=>{let e=11,t=()=>(e=e*16807%2147483647)/2147483647,n=new Float32Array(k*3),r=new Float32Array(k);for(let e=0;e<k;e++)n.set([(t()*2-1)*2.6,t()*A,-.4-t()*1.6],e*3),r[e]=t();return[n,r]},[]),a=(0,C.useMemo)(()=>({uTiempo:{value:0},uVelocidad:{value:0},uAlto:{value:A},uColor:{value:new m},uIntensidad:{value:1}}),[]);return h(({clock:r})=>{let i=n.current.uniforms;i.uTiempo.value=r.elapsedTime,i.uVelocidad.value=e.current.velocidad,i.uColor.value.set(t.brasa),i.uIntensidad.value=t.brasaIntensidad}),(0,O.jsxs)(`points`,{frustumCulled:!1,children:[(0,O.jsxs)(`bufferGeometry`,{children:[(0,O.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[r,3]}),(0,O.jsx)(`bufferAttribute`,{attach:`attributes-aSemilla`,args:[i,1]})]}),(0,O.jsx)(`shaderMaterial`,{ref:n,vertexShader:w,fragmentShader:T,uniforms:a,transparent:!0,depthWrite:!1,blending:t===j.oscuro?2:1})]})}function N({semilla:e,posicion:t,escala:n,tema:r}){let i=(0,C.useRef)(null),a=(0,C.useMemo)(()=>({uTiempo:{value:0},uSemilla:{value:e},uColor:{value:new m},uIntensidad:{value:0}}),[e]);return h(({clock:e})=>{let t=i.current.uniforms;t.uTiempo.value=e.elapsedTime,t.uColor.value.set(r.humo),t.uIntensidad.value=r.humoIntensidad}),(0,O.jsxs)(`mesh`,{position:t,scale:n,children:[(0,O.jsx)(`planeGeometry`,{args:[1,1]}),(0,O.jsx)(`shaderMaterial`,{ref:i,vertexShader:E,fragmentShader:D,uniforms:a,transparent:!0,depthWrite:!1})]})}function P({estado:e,x:t}){let n=j[i()===`claro`?`claro`:`oscuro`];return(0,O.jsxs)(`group`,{position:[t,0,0],children:[(0,O.jsx)(N,{semilla:3.1,posicion:[0,.4,-1.6],escala:[4.2,4.5,1],tema:n}),(0,O.jsx)(N,{semilla:7.7,posicion:[.5,.9,-1.1],escala:[3,3.6,1],tema:n}),(0,O.jsx)(M,{estado:e,tema:n})]})}var F=40,I=.5,L=.05,R=.42,z=c.length,B=c.map(e=>d.find(t=>t.id===e.plato));function V({i:e,estado:t,encuadre:n}){let r=(0,C.useRef)(null),i=B[e];return h(()=>{let i=t.current,a=l(i.t,e,z),o=r.current;o.visible=a.visible,o.position.set(n.x,n.y+a.y*2*y,0),o.scale.setScalar(a.escala),o.rotation.set(R,f(i.p,z)+e*1.3,0)}),(0,O.jsx)(`group`,{ref:r,visible:!1,children:(0,O.jsx)(v,{plato:i})})}var H={fuego:`#ff7a2f`,crujiente:`#ffc35a`,dorado:`#ffb347`,picante:`#ff4d2e`,dulce:`#d29a6a`};function U({seccion:e,capitulo:t,onProgreso:n}){let{size:i,camera:l}=g(),d=i.width/Math.max(1,i.height),f=(0,C.useMemo)(()=>u(y,F,d),[d]),_=(0,C.useRef)({p:0,t:0,k:0,velocidad:0}),v=(0,C.useRef)(null),x=(0,C.useMemo)(()=>new m,[]);return h(()=>{let t=_.current,i=t.p;t.p=r(t.p,s(e.current.getBoundingClientRect(),innerHeight),L),t.velocidad=r(t.velocidad,a(Math.abs(t.p-i)*150,0,1),.1),t.t=o(t.p,z,I),t.k=p(t.t,z),l.position.set(0,0,f.distancia),l.lookAt(0,0,0),v.current.color.lerp(x.set(H[c[t.k].id]),.06),n?.(t.t)}),(0,O.jsxs)(O.Fragment,{children:[(0,O.jsx)(b,{luz:v,color:H.fuego}),(0,O.jsx)(P,{estado:_,x:f.x}),B.map((e,n)=>Math.abs(n-t)<=1&&(0,O.jsx)(V,{i:n,estado:_,encuadre:f},n))]})}function W({seccion:e,activo:t,capitulo:n,onProgreso:r,onListo:i,onPerdido:a}){return(0,O.jsxs)(_,{className:`historia-lienzo`,"aria-hidden":`true`,dpr:[1,1.5],frameloop:`demand`,camera:{fov:F,near:.1,far:30,position:[0,0,4]},gl:{antialias:!0,alpha:!0,powerPreference:`high-performance`},children:[(0,O.jsx)(S,{activo:t}),(0,O.jsx)(x,{onListo:i,onPerdido:a}),(0,O.jsx)(U,{seccion:e,capitulo:n,onProgreso:r})]})}export{W as default};