import{o as e,r as t,t as n}from"./jsx-runtime-Dt7n5OEe.js";import{c as r,d as i,g as a,p as o}from"./config-xzZBF1x6.js";import{r as s}from"./scroll-BQF_hnI4.js";import{n as c,r as l,t as u}from"./clinica-B4zspD2D.js";import{Rt as d,_ as f,a as p,s as m,t as h}from"./react-three-fiber.esm-Bn4ZvWNk.js";import{t as g}from"./Ritmo-BFfOB7HD.js";var _=e(t(),1),v=16;function y(e){let t=e.match(/[MLCQZ]|-?\d*\.?\d+/g),n=[],r=null,i=0,a=null,o=()=>+t[i++];for(;i<t.length;){if(/[MLCQZ]/.test(t[i])&&(a=t[i++]),a===`Z`){r&&n.push(r),r=null,a=null;continue}let e=r?.at(-1);if(a===`M`)r&&n.push(r),r=[[o(),o()]],a=`L`;else if(a===`L`)r.push([o(),o()]);else if(a===`C`){let[t,n]=e,i=o(),a=o(),s=o(),c=o(),l=o(),u=o();for(let e=1;e<=v;e++){let o=e/v,d=1-o;r.push([d**3*t+3*d*d*o*i+3*d*o*o*s+o**3*l,d**3*n+3*d*d*o*a+3*d*o*o*c+o**3*u])}}else if(a===`Q`){let[t,n]=e,i=o(),a=o(),s=o(),c=o();for(let e=1;e<=v;e++){let o=e/v,l=1-o;r.push([l*l*t+2*l*o*i+o*o*s,l*l*n+2*l*o*a+o*o*c])}}else throw Error(`Orden no admitida en el trazado: ${t[i]}`)}return r&&n.push(r),n}function b(e,t,n){let r=0;for(let i=0;i<e.length;i++){let a=e[i];for(let e=0,i=a.length-1;e<a.length;i=e++){let o=a[e],s=a[i],c=o[1],l=s[1];c>n!=l>n&&t<(s[0]-o[0])*(n-c)/(l-c)+o[0]&&r++}}return r%2==1}function x(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var S=128;function C(e,t,n,r,i){let a=r/S,o=i/S,s=(e,r)=>[Math.min(127,Math.max(0,Math.floor((e-t)/a))),Math.min(127,Math.max(0,Math.floor((r-n)/o)))],c=new Uint8Array(16384);for(let t of e)for(let e=0,n=t.length-1;e<t.length;n=e++){let[r,i]=t[n],[l,u]=t[e],d=Math.ceil(Math.max(Math.abs(l-r)/a,Math.abs(u-i)/o)*2)+1;for(let e=0;e<=d;e++){let[t,n]=s(r+(l-r)*e/d,i+(u-i)*e/d);for(let e=-1;e<=1;e++)for(let r=-1;r<=1;r++){let i=t+e,a=n+r;i>=0&&i<S&&a>=0&&a<S&&(c[a*S+i]=1)}}}let l=new Uint8Array(16384);for(let r=0;r<S;r++)for(let i=0;i<S;i++)l[r*S+i]=c[r*S+i]?2:+!!b(e,t+(i+.5)*a,n+(r+.5)*o);return(r,i)=>{let s=Math.min(127,(r-t)/a|0),c=Math.min(127,(i-n)/o|0),u=l[c*S+s];return u===2?b(e,r,i):u===1}}function w(e,t,{semilla:n=1,profundidad:r=.15}={}){let i=y(e),a=x(n),o=i.flat().map(e=>e[0]),s=i.flat().map(e=>e[1]),[c,l,u,d]=[Math.min(...o),Math.max(...o),Math.min(...s),Math.max(...s)],f=(c+l)/2,p=(u+d)/2,m=Math.max(l-c,d-u)/2,h=C(i,c,u,l-c,d-u),g=new Float32Array(t*3),_=0,v=0;for(;_<t;){if(++v>t*200)throw Error(`La figura es demasiado pequeña para muestrearla`);let e=c+a()*(l-c),n=u+a()*(d-u);h(e,n)&&(g[_*3]=(e-f)/m,g[_*3+1]=-(n-p)/m,g[_*3+2]=(a()*2-1)*r,_++)}return g}var T=`
uniform float uMezcla;
uniform float uTiempo;
uniform vec3 uAnclaA;      // centro (x, y) y escala de la figura A en píxeles
uniform vec3 uAnclaB;
uniform vec2 uCampo;       // media pantalla (x, y): escala del campo
uniform float uEsCampoA;   // 1 si A es el campo (sus puntos ocupan toda la pantalla)
uniform float uEsCampoB;
uniform vec2 uPuntero;     // en píxeles desde el centro
uniform float uFuerza;     // 0..1, cuánto aparta el puntero
uniform float uTamano;
attribute vec3 aA;
attribute vec3 aB;
attribute float aSemilla;
varying float vAlfa;
varying float vTono;

vec3 colocar(vec3 p, vec3 ancla, float esCampo) {
  vec2 escala = mix(vec2(ancla.z), uCampo, esCampo);
  vec2 centro = mix(ancla.xy, vec2(0.0), esCampo);
  return vec3(p.xy * escala + centro, p.z * ancla.z);
}

void main() {
  vec3 a = colocar(aA, uAnclaA, uEsCampoA), b = colocar(aB, uAnclaB, uEsCampoB);
  float m = uMezcla;
  vec3 p = mix(a, b, m * m * (3.0 - 2.0 * m));
  // Nube: desvío máximo a mitad de camino, nulo en las figuras.
  float nube = sin(m * 3.14159);
  vec3 ruido = vec3(sin(aSemilla * 91.0 + uTiempo * 0.7), cos(aSemilla * 53.0 + uTiempo * 0.6), 0.0);
  p += ruido * nube * 140.0 * (0.4 + aSemilla);
  // Campo: deriva lenta. Figura: respiración suave.
  float campo = mix(uEsCampoA, uEsCampoB, m);
  p.xy += vec2(sin(uTiempo * 0.21 + aSemilla * 40.0), cos(uTiempo * 0.17 + aSemilla * 30.0)) * 18.0 * campo;
  p.xy += (p.xy - mix(mix(uAnclaA.xy, vec2(0.0), uEsCampoA), mix(uAnclaB.xy, vec2(0.0), uEsCampoB), m)) * 0.012 * sin(uTiempo * 1.3) * (1.0 - campo);
  // El puntero aparta las partículas cercanas.
  vec2 d = p.xy - uPuntero;
  float cerca = exp(-dot(d, d) / 9000.0);
  p.xy += normalize(d + 0.0001) * cerca * 60.0 * uFuerza;
  vec4 vista = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * vista;
  gl_PointSize = uTamano * (0.7 + 0.8 * aSemilla);
  vAlfa = (0.55 + 0.45 * fract(aSemilla * 7.31)) * mix(1.0, 0.35, campo);
  vTono = fract(aSemilla * 13.7);   // posición de cada partícula en el ciclo de iridiscencia
}`,E=`
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTiempo;
varying float vAlfa;
varying float vTono;
vec3 iris(float h) {
  vec3 w = 0.5 + 0.5 * cos(6.2832 * (h - vec3(0.0, 0.3333, 0.6667)));
  return (uColor * w.x + uColor2 * w.y + uColor3 * w.z) / (w.x + w.y + w.z);
}
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 c = mix(uColor, iris(fract(vTono + uTiempo * 0.04)), 0.5);
  gl_FragColor = vec4(c, smoothstep(0.5, 0.15, d) * vAlfa);
  #include <colorspace_fragment>
}`,D=`
uniform vec2 uPantalla;   // ancho y alto en píxeles
uniform float uScroll;    // desplazamiento vertical de la página en píxeles
uniform float uTiempo;
uniform float uTamano;
attribute float aSemilla;
varying float vAlfa;
varying float vTono;
void main() {
  float lejos = position.z, alto = uPantalla.y * 1.3;
  float y = mod(position.y * alto * 0.5 + uScroll * mix(0.45, 0.06, lejos) + alto * 0.5, alto) - alto * 0.5;
  float x = position.x * uPantalla.x * 0.55 + sin(uTiempo * 0.08 + aSemilla * 40.0) * 30.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, -50.0 - lejos * 100.0, 1.0);
  gl_PointSize = uTamano * mix(52.0, 10.0, lejos);
  vAlfa = mix(0.10, 0.22, lejos) * (0.6 + 0.4 * sin(uTiempo * 0.3 + aSemilla * 20.0));
  vTono = fract(aSemilla * 7.7);
}`,O=`
uniform vec3 uColor;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying float vAlfa;
varying float vTono;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  vec3 c = vTono < 0.33 ? uColor : vTono < 0.66 ? uColor2 : uColor3;
  gl_FragColor = vec4(c, exp(-d * d * 14.0) * vAlfa);
  #include <colorspace_fragment>
}`,k=n(),A=.08,j={oscuro:{acento:`#f0a3bd`,agua:`#8fd8d2`,lavanda:`#cdbcf5`},claro:{acento:`#a8325e`,agua:`#1d6e72`,lavanda:`#6a58b8`}},M=[`acento`,`acento`,`agua`,`acento`,`agua`,`agua`],N=900;function P(e){let t=new Float32Array(e*3),n=5,r=()=>(n=n*16807%2147483647)/2147483647;for(let n=0;n<e;n++)t.set([r()*2-1,r()*2-1,r()*.3-.15],n*3);return u.map((n,r)=>n===`campo`?t:w(l[n].d,e,{semilla:r+1}))}function F(e,t){let n=e>=1&&e<=4&&document.querySelector(`[data-ancla-tramo]`)||document.querySelector(`[data-ancla="${u[e]}"]`);if(!n)return null;let r=n.getBoundingClientRect();return t.set(r.left+r.width/2-innerWidth/2,innerHeight/2-(r.top+r.height/2),Math.min(r.width,r.height)*.46),t}function I({n:e,onProgreso:t,onListo:n,onPerdido:l}){let{gl:h}=m(),g=i()===`claro`?`claro`:`oscuro`,v=(0,_.useMemo)(()=>Object.fromEntries(Object.entries(j[g]).map(([e,t])=>[e,new f(t)])),[g]),y=r(),b=(0,_.useRef)(null),x=(0,_.useRef)(null),S=(0,_.useRef)({entrada:0,p:0,salida:0,par:``,fuerza:0,listo:!1});(0,_.useEffect)(()=>{let e=h.domElement,t=()=>l?.();return e.addEventListener(`webglcontextlost`,t),()=>e.removeEventListener(`webglcontextlost`,t)},[h,l]);let C=(0,_.useMemo)(()=>P(e),[e]),w=(0,_.useMemo)(()=>Float32Array.from({length:e},(e,t)=>t*.6180339887%1),[e]),D=(0,_.useMemo)(()=>[C[0].slice(),C[1].slice()],[C]),O=(0,_.useMemo)(()=>({uMezcla:{value:0},uTiempo:{value:0},uAnclaA:{value:new d},uAnclaB:{value:new d},uCampo:{value:[1,1]},uEsCampoA:{value:0},uEsCampoB:{value:0},uPuntero:{value:[9999,9999]},uFuerza:{value:0},uTamano:{value:3},uColor:{value:new f},uColor2:{value:new f},uColor3:{value:new f}}),[]);return p(({clock:e})=>{let r=S.current,i=b.current.uniforms,l=x.current,d=document.getElementById(`tratamientos-tramo`)??document.getElementById(`tratamientos`);if(d){let e=d.getBoundingClientRect(),t=innerHeight;r.entrada=a(r.entrada,o(1-e.top/t,0,1),A),r.p=a(r.p,s(e,t),A),r.salida=a(r.salida,o((t-e.bottom)/t,0,1),A)}let{a:f,b:p,mezcla:m}=c(r);`${f}-${p}`!==r.par&&(r.par=`${f}-${p}`,l.attributes.aA.array.set(C[f]),l.attributes.aA.needsUpdate=!0,l.attributes.aB.array.set(C[p]),l.attributes.aB.needsUpdate=!0),i.uMezcla.value=m,i.uEsCampoA.value=+(u[f]===`campo`),i.uEsCampoB.value=+(u[p]===`campo`),F(f,i.uAnclaA.value),F(p,i.uAnclaB.value),i.uCampo.value=[innerWidth/2,innerHeight/2],i.uTiempo.value=e.elapsedTime,i.uTamano.value=2.6*h.getPixelRatio();let g=m<.5?f:p;i.uColor.value.lerp(v[M[g]],.08),i.uColor2.value.lerp(v.agua,.08),i.uColor3.value.lerp(v.lavanda,.08);let _=y.current;i.uPuntero.value=_.activo?[_.x-innerWidth/2,innerHeight/2-_.y]:[9999,9999],r.fuerza=a(r.fuerza,+!!_.activo,.05),i.uFuerza.value=r.fuerza,t?.(r),r.listo||(r.listo=!0,n?.())}),(0,k.jsxs)(`points`,{frustumCulled:!1,children:[(0,k.jsxs)(`bufferGeometry`,{ref:x,children:[(0,k.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[D[0],3]}),(0,k.jsx)(`bufferAttribute`,{attach:`attributes-aA`,args:[D[0],3]}),(0,k.jsx)(`bufferAttribute`,{attach:`attributes-aB`,args:[D[1],3]}),(0,k.jsx)(`bufferAttribute`,{attach:`attributes-aSemilla`,args:[w,1]})]}),(0,k.jsx)(`shaderMaterial`,{ref:b,vertexShader:T,fragmentShader:E,uniforms:O,transparent:!0,depthWrite:!1})]})}function L(){let{gl:e}=m(),t=i()===`claro`,n=j[t?`claro`:`oscuro`],r=(0,_.useRef)(null),[a,o]=(0,_.useMemo)(()=>{let e=9,t=()=>(e=e*16807%2147483647)/2147483647,n=new Float32Array(N*3),r=new Float32Array(N);for(let e=0;e<N;e++)n.set([t()*2-1,t()*2-1,t()**.6],e*3),r[e]=t();return[n,r]},[]),s=(0,_.useMemo)(()=>({uPantalla:{value:[1,1]},uScroll:{value:0},uTiempo:{value:0},uTamano:{value:1},uColor:{value:new f},uColor2:{value:new f},uColor3:{value:new f}}),[]);return p(({clock:t})=>{let i=r.current.uniforms;i.uPantalla.value=[innerWidth,innerHeight],i.uScroll.value=scrollY,i.uTiempo.value=t.elapsedTime,i.uTamano.value=e.getPixelRatio(),i.uColor.value.set(n.acento),i.uColor2.value.set(n.agua),i.uColor3.value.set(n.lavanda)}),(0,k.jsxs)(`points`,{frustumCulled:!1,renderOrder:-1,children:[(0,k.jsxs)(`bufferGeometry`,{children:[(0,k.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[a,3]}),(0,k.jsx)(`bufferAttribute`,{attach:`attributes-aSemilla`,args:[o,1]})]}),(0,k.jsx)(`shaderMaterial`,{ref:r,vertexShader:D,fragmentShader:O,uniforms:s,transparent:!0,depthWrite:!1,blending:t?1:2})]})}function R({onProgreso:e,onListo:t,onPerdido:n}){let r=typeof window<`u`&&(matchMedia(`(pointer: coarse)`).matches||innerWidth<768)?1e4:24e3;return(0,k.jsxs)(h,{className:`particulas`,"aria-hidden":`true`,orthographic:!0,dpr:[1,1.5],frameloop:`demand`,camera:{position:[0,0,500],zoom:1,near:.1,far:1e3},gl:{antialias:!1,alpha:!0,powerPreference:`high-performance`},children:[(0,k.jsx)(g,{}),(0,k.jsx)(L,{}),(0,k.jsx)(I,{n:r,onProgreso:e,onListo:t,onPerdido:n})]})}export{R as default};