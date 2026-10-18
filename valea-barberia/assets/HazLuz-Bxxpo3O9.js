import{o as e,r as t,t as n}from"./jsx-runtime-Dt7n5OEe.js";import{h as r,l as i,m as a,o}from"./config-oE5o8erc.js";import{n as s,t as c}from"./barberia-EdxxYVcT.js";import{a as l,s as u,t as d}from"./react-three-fiber.esm-Bn4ZvWNk.js";import{t as f}from"./Texture-CVAd0xjR.js";import{t as p}from"./Senales-DrGzUvJ4.js";var m=e(t(),1),h=n(),g=3,_=`
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,v=`
uniform sampler2D uFoto;
uniform vec2 uPuntero;      // 0..1, origen abajo a la izquierda
uniform vec2 uCover;        // fracción visible de la foto
uniform float uAspecto;     // ancho / alto de la pantalla
uniform float uTiempo;
uniform float uFuerza;      // 0..1: cuánto se mueve el puntero (ondas)
uniform float uClaro;       // 0 = oscuro (penumbra), 1 = claro (velo marfil)
varying vec2 vUv;
void main() {
  vec2 d = vUv - uPuntero; d.x *= uAspecto;
  float dist = length(d);
  // Ondas que nacen en el puntero y se apagan con la distancia.
  float onda = sin(dist * 38.0 - uTiempo * 4.0) * exp(-dist * 6.0) * 0.012 * (0.35 + uFuerza);
  vec2 uv = (vUv - 0.5) * uCover + 0.5 + normalize(d + 1e-5) * onda;
  vec3 color = texture2D(uFoto, uv).rgb;
  // Haz: revela la foto alrededor del puntero; fuera queda en penumbra.
  float haz = smoothstep(0.55, 0.05, dist);
  vec3 penumbra = color * mix(0.16, 1.08, haz);
  vec3 velo = mix(vec3(0.96, 0.94, 0.91) * 0.94 + color * 0.06, color * 1.02, haz);
  color = mix(penumbra, velo, uClaro);
  float filo = smoothstep(0.012, 0.0, abs(dist - 0.40));   // borde del haz
  color += vec3(0.79, 0.54, 0.02) * filo * 0.14 * (1.0 - uClaro);          // oscuro: filo de luz dorada
  color = mix(color, vec3(0.52, 0.30, 0.05), filo * 0.55 * uClaro);        // claro: filo de oro oscuro
  gl_FragColor = vec4(color, 1.0);
}`;function y({foto:e,aspectoFoto:t,onListo:n}){let d=f(e);(0,m.useEffect)(()=>{n?.()},[n]);let p=o(),y=i()===`claro`,{size:b,gl:x}=u(),S=(0,m.useRef)(null),C=(0,m.useRef)({x:.5,y:.5,ux:p.current.x,uy:p.current.y,quieto:0,fuerza:0,rect:null}),w=(0,m.useMemo)(()=>({uFoto:{value:d},uPuntero:{value:[.5,.5]},uCover:{value:[1,1]},uAspecto:{value:1},uTiempo:{value:0},uFuerza:{value:0},uClaro:{value:0}}),[d]);return l((e,n)=>{let i=C.current,o=p.current,l=S.current.uniforms,u=o.x!==i.ux||o.y!==i.uy;i.quieto=u?0:i.quieto+n,i.fuerza=a(i.fuerza,+!!u,.08),i.ux=o.x,i.uy=o.y,(u||!i.rect)&&(i.rect=x.domElement.getBoundingClientRect());let d=i.quieto>g||!o.activo?s(l.uTiempo.value):(({x:e,y:t})=>({x:e,y:1-t}))(r(o.x,o.y,i.rect));i.x=a(i.x,d.x,.09),i.y=a(i.y,d.y,.09),l.uPuntero.value[0]=i.x,l.uPuntero.value[1]=i.y,l.uTiempo.value+=n,l.uFuerza.value=i.fuerza,l.uClaro.value=a(l.uClaro.value,+!!y,.08),l.uAspecto.value=b.width/b.height;let[f,m]=c(b.width/b.height,t);l.uCover.value[0]=f,l.uCover.value[1]=m}),(0,h.jsxs)(`mesh`,{children:[(0,h.jsx)(`planeGeometry`,{args:[2,2]}),(0,h.jsx)(`shaderMaterial`,{ref:S,vertexShader:_,fragmentShader:v,uniforms:w})]})}function b({foto:e,aspectoFoto:t,activo:n,onListo:r,onPerdido:i}){return(0,h.jsxs)(d,{className:`haz-luz`,"aria-hidden":`true`,dpr:[1,1.5],frameloop:n?`always`:`never`,gl:{antialias:!1,powerPreference:`high-performance`},children:[(0,h.jsx)(p,{onPerdido:i}),(0,h.jsx)(y,{foto:e,aspectoFoto:t,onListo:r})]})}export{b as default};