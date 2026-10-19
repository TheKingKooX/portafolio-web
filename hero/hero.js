/* GENERADO por tools/make-hero.js a partir del fondo original. No editar a mano: cambia el script y vuelve a generarlo.
   Three.js (MIT) y GSAP (licencia estándar de GreenSock) se cargan desde js/vendor. */
(() => {
if (!window.THREE || !window.gsap) { Lab.hero.fail('libs'); return; }
const host = document.getElementById('hero-stage');
const $ = s => host.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* ---------- Configuración del fondo (URL ?q=media&fps=30&intro=10  o panel de Lively) ---------- */
const QUALITY = { baja: 30000, media: 52000, alta: 76000 };
const CFG = Lab.hero.config;   // { q, fps, intro, skipIntro }
const small = CFG.q === 'baja';
const N = QUALITY[CFG.q];
const FOV = 35, TAN = Math.tan(FOV * Math.PI / 360);
const R = 2.2, GAP = .075;
const NF = Math.floor(N * .7);   // 70% cara, 30% logotipo "The Bros V"
const WORD_BIG = 9.6;            // ancho del logotipo grande (acto 2)
const TBV_W = 4.6, TBV_Y = -3.35, SHIFT = .8;
const TXT_W = 2;                 // marca de partícula: letra blanca nítida (sin glow)

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas: $('#hero-gl'), antialias: false, powerPreference: 'high-performance' }); }
catch (e) { Lab.hero.fail('webgl'); return; }
const PR = Math.min(devicePixelRatio || 1, 1.25);
renderer.setPixelRatio(PR);
renderer.setClearColor(0x030A0C, 1);
const scene = new THREE.Scene();
const W = () => Math.max(1, host.clientWidth), H = () => Math.max(1, host.clientHeight);
const camera = new THREE.PerspectiveCamera(FOV, W() / H(), .1, 200);
camera.position.set(0, 0, 24);


/* =================== FONDO: aurora + retícula que reacciona =================== */
const BU = {
  uTime: { value: 0 }, uRes: { value: new THREE.Vector2(W(), H()) },
  uMouse: { value: new THREE.Vector2(.5, .5) }, uClick: { value: new THREE.Vector3(.5, .5, -1) },
  uFace: { value: new THREE.Vector2(0, 0) }, uFaceGlow: { value: 0 }, uIntro: { value: 0 }
};
const bg = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
  uniforms: BU, depthTest: false, depthWrite: false,
  vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }`,
  fragmentShader: `
    uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform vec3 uClick; uniform vec2 uFace; uniform float uFaceGlow; uniform float uIntro;
    varying vec2 vUv;
    float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
    float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
      return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y); }
    float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<5;i++){ v+=a*noise(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return v; }
    void main(){
      vec2 asp=vec2(uRes.x/uRes.y,1.);
      vec2 p=(vUv-.5)*asp; vec2 m=(uMouse-.5)*asp;
      float t=uTime*.05;
      vec2 q=vec2(fbm(p*1.3+vec2(t,-t)), fbm(p*1.3+vec2(5.2,1.3)-t));
      float f=fbm(p*1.7+q*1.8+vec2(t*1.5,0.));
      vec3 cL=vec3(.0,.62,.66), cR=vec3(.85,.34,.0);
      vec3 tint=mix(cL,cR,smoothstep(-.7,.7,p.x+m.x*.5));
      vec3 col=mix(vec3(.010,.022,.028), vec3(.016,.040,.048), vUv.y);
      col+=tint*pow(f,3.2)*.42*uIntro;
      float md=length(p-m);
      vec3 mt=mix(cL,cR,smoothstep(-.15,.15,m.x));
      col+=mt*exp(-md*md*7.)*.10;
      float fd=length(p-uFace);
      col+=mix(cL,cR,smoothstep(uFace.x-.25,uFace.x+.25,p.x))*exp(-fd*fd*4.5)*.12*uFaceGlow;
      vec2 cp=(uClick.xy-.5)*asp; float cd=length(p-cp); float age=uClick.z;
      float rq=(cd-age*.75)*12.; float rip=exp(-rq*rq)*exp(-age*1.1)*step(0.,age);
      float near=exp(-md*md*14.);
      vec2 gp=p-(p-m)*near*.28 + normalize(p-cp+1e-4)*rip*.025;
      float cell=30./uRes.y;
      vec2 g=fract(gp/cell)-.5;
      float dt=1.-smoothstep(.04,.09,length(g));
      col+=mix(vec3(.55,.7,.75),mt,near)*dt*(.045+near*.35+rip*.8)*uIntro;
      col+=mt*rip*.12;
      col*=1.-.6*dot(p*.75,p*.75);
      col+=(hash(vUv*uRes+fract(uTime)*97.)-.5)*.03;
      gl_FragColor=vec4(col,1.);
    }`
}));
bg.frustumCulled = false; bg.renderOrder = -2; scene.add(bg);

/* =================== POLVO de fondo (profundidad) =================== */
const DN = small ? 5000 : CFG.q === 'alta' ? 15000 : 11000;
const dPos = new Float32Array(DN * 3), dSeed = new Float32Array(DN * 3);
for (let i = 0; i < DN; i++) {
  dPos[i*3] = (Math.random() - .5) * 60; dPos[i*3+1] = (Math.random() - .5) * 40; dPos[i*3+2] = 2 - Math.random() * 44;
  dSeed[i*3] = Math.random(); dSeed[i*3+1] = Math.random(); dSeed[i*3+2] = Math.random();
}
const dGeo = new THREE.BufferGeometry();
dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
dGeo.setAttribute('aSeed', new THREE.BufferAttribute(dSeed, 3));
const DU = { uTime: { value: 0 }, uPR: { value: PR } };
const dust = new THREE.Points(dGeo, new THREE.ShaderMaterial({
  uniforms: DU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `attribute vec3 aSeed; uniform float uTime,uPR; varying float vA; varying vec3 vC;
    void main(){ vec3 p=position; p.y=mod(p.y+uTime*(.15+aSeed.x*.25)+20.,40.)-20.; p.x+=sin(uTime*.2+aSeed.y*6.28)*.6;
      vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv;
      float tw=.55+.45*sin(uTime*(.8+aSeed.y*2.)+aSeed.z*40.);           // centelleo
      gl_PointSize=(1.+aSeed.z*2.6)*uPR*(16./max(-mv.z,1.));
      // colores de marca: la mayoría blanco-cian, algunos verdes y naranjas
      float k=aSeed.y;
      vC=k<.55?vec3(.6,.88,.95):k<.72?vec3(.13,.97,1.):k<.86?vec3(.2,1.,.45):vec3(1.,.55,.15);
      vA=(.25+aSeed.x*.5)*tw*smoothstep(-46.,-12.,mv.z)*(1.-smoothstep(-6.,-2.,mv.z)); }`,
  fragmentShader: `varying float vA; varying vec3 vC; void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard;
    float r=d*2.; float a=pow(max(0.,1.-r*1.5),2.)+exp(-r*r*6.)*.35; gl_FragColor=vec4(vC*a*vA*.55,1.); }`
}));
dust.frustumCulled = false; scene.add(dust);

/* =================== FORMAS (cada una = N destinos) =================== */
const rand = Math.random;
function genChaos() {
  const a = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.pow(rand(), .6) * 9, th = rand() * Math.PI * 2, ph = Math.acos(2 * rand() - 1);
    a[i*4] = r * Math.sin(ph) * Math.cos(th); a[i*4+1] = r * Math.sin(ph) * Math.sin(th) * .8; a[i*4+2] = r * Math.cos(ph) * .6; a[i*4+3] = 0;
  }
  return a;
}
function genLine() {
  const a = new Float32Array(N * 4);
  for (let i = 0; i < N; i++) {
    const y = (rand() + rand() + rand() - 1.5) / 1.5 * 3.6;
    a[i*4] = (rand() - .5) * .05; a[i*4+1] = y; a[i*4+2] = (rand() - .5) * .25; a[i*4+3] = 1;
  }
  return a;
}
/* Logotipo personalizado "The Bros V":
   "The" manuscrita e inclinada, "BROS" en itálica pesada, una "V" partida como la cara
   (la mitad derecha desplazada) y un trazo-sonrisa debajo que lo abraza todo. */
function drawLogo(g) {
  const x0 = 520, base = 470, capH = 196, SK = -.2;
  g.fillStyle = '#fff';
  // "The" manuscrita
  g.save();
  g.translate(x0 - 80, 256); g.rotate(-.14);
  g.font = '700 250px Caveat,"Segoe Script","Ink Free",cursive';
  g.textBaseline = 'alphabetic'; g.fillText('The', 0, 0);
  g.restore();
  // "BROS" en itálica
  g.save();
  g.setTransform(1, 0, SK, 1, -SK * base, 0);
  g.font = '800 270px Syne,"Arial Black",sans-serif';
  if ('letterSpacing' in g) g.letterSpacing = '16px';   // letras más separadas y legibles
  g.textBaseline = 'alphabetic'; g.fillText('BROS', x0, base);
  const wB = g.measureText('BROS').width;
  // "V" partida
  const xV = x0 + wB + 56, top = base - capH, cx = xV + 118, st = 80, gap = 9;
  const arm = (s, dx, dy) => {
    g.beginPath();
    g.moveTo(cx + s * 118 + dx, top + dy);
    g.lineTo(cx + s * (118 - st) + dx, top + dy);
    g.lineTo(cx + s * gap + dx, base - 70 + dy);
    g.lineTo(cx + s * gap + dx, base + dy);
    g.lineTo(cx + s * 44 + dx, base + dy);
    g.closePath(); g.fill();
  };
  g.fillStyle = '#f00';            // la V se marca en rojo para detectarla al muestrear
  arm(-1, 0, 0); arm(1, 12, 18);
  g.restore();
  g.fillStyle = '#fff';
  // trazo-sonrisa (medialuna afilada en los extremos)
  const sx = x0 - 60, sy = base + 38, ex = xV + 300, ey = base - 30, mx = (sx + ex) / 2;
  g.beginPath();
  g.moveTo(sx, sy);
  g.quadraticCurveTo(mx, base + 150, ex, ey);
  g.quadraticCurveTo(mx, base + 96, sx, sy);
  g.fill();
  // remate: gota al final del trazo
  g.beginPath(); g.arc(ex + 16, ey - 22, 17, 0, Math.PI * 2); g.fill();
}
function sampleText() {
  const W = 2600, H = 760, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d', { willReadFrequently: true });
  drawLogo(g);
  const d = g.getImageData(0, 0, W, H).data, raw = [], isV = [];
  let x1 = W, x2 = 0, y1 = H, y2 = 0;
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) {
    const o = (y * W + x) * 4;
    if (d[o + 3] <= 128) continue;
    raw.push(x, y); isV.push(d[o + 1] < 128);      // píxel rojo = V
    if (x < x1) x1 = x; if (x > x2) x2 = x; if (y < y1) y1 = y; if (y > y2) y2 = y;
  }
  const cx = (x1 + x2) / 2, cy = (y1 + y2) / 2, pts = [], vu = [], vf = [];
  for (let i = 0; i < isV.length; i++) {
    const px = raw[i*2] - cx, py = -(raw[i*2+1] - cy);
    // la V recibe más densidad; vu = posición 0..1 a lo ancho del logotipo
    const reps = isV[i] ? 2 : 1, u = (raw[i*2] - x1) / Math.max(1, x2 - x1);
    for (let r = 0; r < reps; r++) { pts.push(px, py); vu.push(u); vf.push(isV[i]); }
  }
  return { pts, vu, vf, tw: x2 - x1, th: y2 - y1 };
}
function fillText(a, from, to, S, width, cy, depth, maxH = 1e9) {
  const k = Math.min(width / S.tw, maxH / S.th), n = S.pts.length / 2;
  for (let i = from; i < to; i++) {
    const j = (rand() * n | 0) * 2;
    a[i*4] = (S.pts[j] + (rand() - .5) * 1.2) * k;
    a[i*4+1] = (S.pts[j+1] + (rand() - .5) * 1.2) * k + cy;
    a[i*4+2] = (rand() - .5) * depth;
    if (rand() < .08) {                       // aura: partículas sueltas alrededor de las letras
      const ang = rand() * Math.PI * 2, rr = (.15 + Math.pow(rand(), 1.5) * .9) * width * .08;
      a[i*4] += Math.cos(ang) * rr; a[i*4+1] += Math.sin(ang) * rr; a[i*4+2] += (rand() - .5) * depth * 2;
    }
    const u = S.vu[j / 2];
    a[i*4+3] = (S.vf[j / 2] ? 4 : 3) + u * .9;   // 3.x = logotipo, 4.x = V; x = posición para el color
  }
}
function genTBV(S) { const a = new Float32Array(N * 4); fillText(a, 0, N, S, WORD_BIG, 0, .7); return a; }
function genFace(S) {
  const a = new Float32Array(N * 4);
  fillText(a, NF, N, S, TBV_W, TBV_Y, .35, 1.05);
  for (let i = 0; i < NF; i++) {
    let x, y, z, w = 0; const u = rand();
    if (u < .045) {                    // la línea divisoria (playhead)
      x = (rand() - .5) * .03; y = (rand() * 2 - 1) * R * 1.1; z = .5 + (rand() - .5) * .5; w = 1;
    } else if (u < .82) {              // volumen de la cara (lente 3D)
      do { const t = rand() * Math.PI * 2, r = R * Math.sqrt(rand()); x = Math.cos(t) * r * 1.04; y = Math.sin(t) * r; } while (Math.abs(x) < GAP);
      const rr = Math.min(1, (x * x / 1.08 + y * y) / (R * R)), zf = Math.sqrt(1 - rr) * R * .55, v = rand();
      z = v < .72 ? zf + (rand() - .5) * .07 : v < .9 ? -zf * .5 + (rand() - .5) * .07 : (rand() * 1.5 - .5) * zf;
    } else {                            // halo de polvo alrededor
      do { const t = rand() * Math.PI * 2, r = R * (1.06 + Math.pow(rand(), 1.8) * 1.05); x = Math.cos(t) * r * 1.04; y = Math.sin(t) * r; } while (Math.abs(x) < GAP || y < -2.55);
      z = (rand() - .5) * 2.2;
    }
    a[i*4] = x; a[i*4+1] = y; a[i*4+2] = z; a[i*4+3] = w;
  }
  return a;
}

/* =================== PARTÍCULAS =================== */
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
const aFrom = new THREE.BufferAttribute(new Float32Array(N * 4), 4).setUsage(THREE.DynamicDrawUsage);
const aTo = new THREE.BufferAttribute(new Float32Array(N * 4), 4).setUsage(THREE.DynamicDrawUsage);
const aDelay = new THREE.BufferAttribute(new Float32Array(N), 1).setUsage(THREE.DynamicDrawUsage);
const rnd = new Float32Array(N * 4);
for (let i = 0; i < N; i++) {
  rnd[i*4] = rand() < .05 ? 1.8 + rand() * 1.2 : .6 + rand() * .9;
  rnd[i*4+1] = .35 + rand() * .65; rnd[i*4+2] = rand(); rnd[i*4+3] = rand();
}
geo.setAttribute('aFrom', aFrom); geo.setAttribute('aTo', aTo); geo.setAttribute('aDelay', aDelay);
geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));

const U = {
  uTime: { value: 0 }, uMorph: { value: 1 }, uFace: { value: 0 }, uSize: { value: small ? 2.9 : 2.5 }, uPR: { value: PR },
  uCam: { value: 1 }, uScatter: { value: 1 }, uEyeL: { value: 1 }, uEyeR: { value: 1 }, uEyePop: { value: 0 },
  uSmile: { value: 0 }, uSplit: { value: 0 }, uAlpha: { value: small ? .7 : .55 },
  uLook: { value: new THREE.Vector2() }, uMouse: { value: new THREE.Vector3(0, 0, 0) }, uMouseOn: { value: 0 },
  uWave: { value: new THREE.Vector4(0, 0, 0, -1) }
};

const pointsMat = new THREE.ShaderMaterial({
  uniforms: U, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: `
    attribute vec4 aFrom; attribute vec4 aTo; attribute vec4 aRnd; attribute float aDelay;
    uniform float uTime,uMorph,uFace,uSize,uPR,uCam,uScatter,uEyeL,uEyeR,uEyePop,uSmile,uSplit;
    uniform vec2 uLook; uniform vec3 uMouse; uniform float uMouseOn; uniform vec4 uWave;
    varying vec3 vColor; varying float vAlpha; varying float vTxt;

    vec3 palette(vec3 p){
      float yy=clamp(p.y*.2+.5,0.,1.);
      vec3 L=mix(vec3(0.,.82,.12),vec3(.13,.95,1.),yy);
      vec3 R=mix(vec3(.30,1.,0.),vec3(1.,.40,0.),yy);
      return mix(L,R,smoothstep(-.25,.25,p.x));
    }
    // Ojo izquierdo: mancha líquida que ondula
    float blobL(vec2 p){
      vec2 c=vec2(-.8,.55)+uLook*.08; vec2 r=max(vec2(.30,.44*uEyeL)*uEyePop,vec2(1e-3));
      vec2 d=(p-c)/r; float a=atan(d.y,d.x);
      float w=.14*sin(3.*a+uTime*1.4)+.09*sin(5.*a-uTime*2.1)+.06*sin(7.*a+uTime*.7);
      return (length(d)-(1.+w))*min(r.x,r.y);
    }
    // Ojo derecho: salpicadura de tinta que gotea
    float blobR(vec2 p){
      vec2 c=vec2(.82,.5)+uLook*.08; vec2 r=max(vec2(.40,.34*uEyeR)*uEyePop,vec2(1e-3));
      vec2 d=(p-c)/r; float a=atan(d.y,d.x);
      float w=.10*sin(2.*a+uTime)+.07*sin(6.*a-uTime*1.6);
      w+=(.55*pow(max(0.,-sin(a)),10.)*(.6+.4*sin(uTime*1.3))+.32*pow(max(0.,-sin(a-.55)),14.)*(.6+.4*sin(uTime*.9+2.)))*uEyeR;
      return (length(d)-(1.+w))*min(r.x,r.y);
    }
    float smileD(vec2 p){
      float hw=1.25; float x=p.x;
      float ys=-.95+(.55+.05*sin(uTime*1.2))*(x*x)/(hw*hw);
      float d=abs(p.y-ys)-.085*(1.-.6*smoothstep(.7,1.,abs(x)/hw));
      d=max(d,abs(x)-hw);
      d=max(d,x-mix(-hw-.1,hw+.1,uSmile));
      return d;
    }
    // Color del logotipo: degradado de marca (cian → verde → naranja → rosa)
    // que se desplaza lenta y progresivamente a lo largo de la palabra
    vec3 wordColor(float u){
      vec3 c1=vec3(.13,.97,1.), c2=vec3(0.,.95,.35), c3=vec3(1.,.5,0.), c4=vec3(1.,.22,.6);
      float g=fract(u*.55-uTime*.06)*4.;
      return g<1.?mix(c1,c2,g):g<2.?mix(c2,c3,g-1.):g<3.?mix(c3,c4,g-2.):mix(c4,c1,g-3.);
    }
    void main(){
      float t=clamp((uMorph-aDelay*.45)/.55,0.,1.);
      t=t<.5?4.*t*t*t:1.-pow(-2.*t+2.,3.)/2.;
      vec3 p=mix(aFrom.xyz,aTo.xyz,t);
      float tr=sin(t*3.14159);
      vec3 n=vec3(sin(p.y*1.3+uTime*.9+aRnd.z*6.28), sin(p.z*1.1+uTime*1.1+aRnd.w*6.28), sin(p.x*1.2+uTime*.7+aRnd.z*3.));
      p+=n*(tr*.9+.022+uScatter*1.4);
      float wv=mix(aFrom.w,aTo.w,t);
      float white=clamp(wv,0.,1.);
      float txt=clamp(wv-1.,0.,1.);              // letras: blanco nítido, sin glow
      float vw=max(aFrom.w,aTo.w);
      float isT=step(2.99,vw)*clamp(wv-2.,0.,1.); // partículas del logotipo
      float isV=step(3.99,vw)*isT;                // la "V" (brilla un poco más)
      float vu=clamp(fract(vw)/.9,0.,1.);         // posición 0..1 a lo ancho del logotipo
      vec3 col=mix(palette(aFrom.xyz),palette(aTo.xyz),t);
      col=mix(col,vec3(1.),white*mix(.85,1.,txt));
      float size=aRnd.x, alpha=aRnd.y*(1.+txt*.3);
      float tw=.75+.25*sin(uTime*(3.+aRnd.w*4.)+aRnd.z*50.);
      col=mix(col,mix(wordColor(vu),vec3(1.),.1),isT);
      size*=1.+isV*(.25+.2*tw);
      alpha*=1.+isV*(.8*tw);
      txt*=1.-isV;                                 // la V sí brilla

      if(uFace>.001){
        vec2 fp=aTo.xy;
        float onFace=step(-2.6,aTo.y);
        float sd=sign(aTo.x)*max(0.,1.-aTo.w)*uFace*onFace;
        p.x+=sd*uSplit*.2; p.y-=sd*uSplit*.28;
        float e=min(blobL(fp),blobR(fp));
        float d=min(e,smileD(fp));
        float hole=1.-smoothstep(-.03,.015,d);
        float rim=(1.-smoothstep(0.,.12,abs(d)))*smoothstep(0.,.25,uEyePop+uSmile);
        vec2 pl=vec2(-.8,.55)+uLook*.17, pr=vec2(.82,.5)+uLook*.17;
        float pu=(1.-smoothstep(.07,.13,min(length(fp-pl),length(fp-pr))))*step(e,0.)*min(uEyePop,1.);
        hole*=(1.-pu)*uFace*onFace; rim*=uFace*max(0.,1.-aTo.w);
        col=mix(col,vec3(1.,.98,.92),clamp(rim*.7+pu,0.,1.));
        size*=(1.-hole)*(1.+rim*.9+pu*.8);
        alpha*=(1.-hole)*(1.+rim*.6);
      }

      vec4 world=modelMatrix*vec4(p,1.);
      vec3 dm=world.xyz-uMouse; float md=length(dm.xy);
      float f=exp(-md*md*1.6)*uMouseOn;
      world.xy+=normalize(dm.xy+1e-4)*f*.55; world.z+=f*.7;
      vec3 dw=world.xyz-uWave.xyz; float wr=length(dw);
      float wq=(wr-uWave.w*5.)*1.8; float k=exp(-wq*wq)*exp(-uWave.w*.9)*step(0.,uWave.w);
      world.xyz+=normalize(dw+1e-4)*k*.7;
      col+=k*.6;

      vec4 mv=viewMatrix*world;
      gl_Position=projectionMatrix*mv;
      // las partículas con glow se agrandan para dejar sitio al halo; las letras no
      gl_PointSize=uSize*size*uPR*uCam*(10./-mv.z)*(1.6-txt*.6);
      vColor=col; vAlpha=alpha*(.35+.65*smoothstep(-34.,-6.,mv.z)); vTxt=txt;
    }`,
  fragmentShader: `
    uniform float uAlpha; varying vec3 vColor; varying float vAlpha; varying float vTxt;
    void main(){ float d=length(gl_PointCoord-.5); if(d>.5) discard;
      float r=d*2.;
      float core=pow(max(0.,1.-r*1.6),2.2);           // núcleo nítido
      float halo=exp(-r*r*5.)*(1.-r);                  // resplandor suave
      float glowA=core+halo*.32;
      float flatA=pow(max(0.,1.-r),1.6);               // letras: punto limpio, sin halo
      float a=mix(glowA,flatA,vTxt);
      gl_FragColor=vec4(vColor*a*vAlpha*uAlpha,1.); }`
});
const group = new THREE.Group();
const points = new THREE.Points(geo, pointsMat);
points.frustumCulled = false;
group.add(points); scene.add(group);

/* =================== MORPH =================== */
function setTarget(shape, mode) {
  aFrom.array.set(aTo.array); aTo.array.set(shape);
  const d = aDelay.array;
  for (let i = 0; i < N; i++) {
    const x = shape[i*4];
    d[i] = mode === 'sweep' ? Math.min(1, Math.max(0, (x + 5) / 10)) * .65 + rand() * .35
         : mode === 'center' ? Math.min(1, Math.abs(x) / R) * .7 + rand() * .3
         : rand();
  }
  aFrom.needsUpdate = aTo.needsUpdate = aDelay.needsUpdate = true;
}
function setInstant(shape) { aFrom.array.set(shape); aTo.array.set(shape); aFrom.needsUpdate = aTo.needsUpdate = true; }

/* =================== ESTADO + CÁMARA =================== */
const S = { rotY: 0, rotX: 0, posY: 0, camZ: 24, idle: 0, lookX: 0, lookY: 0, splitAuto: 0 };
const aspect = () => W() / H();
const camWords = () => Math.max(10, (WORD_BIG * .56) / (TAN * aspect()), 2.4 / TAN);
const camFace = () => Math.max(12.2, 3.1 / (TAN * aspect()), 4.35 / TAN);


/* =================== INTERACCIÓN =================== */
const mouse = { x: 0, y: 0, sx: 0, sy: 0, on: false };
const tmpV = new THREE.Vector3(), mWorld = new THREE.Vector3();
let clockT = 0, waveStart = -99, introDone = false;

function worldAt(nx, ny, out) {
  tmpV.set(nx, ny, .5).unproject(camera).sub(camera.position).normalize();
  const dist = -camera.position.z / tmpV.z;
  return out.copy(camera.position).addScaledVector(tmpV, dist);
}
function fireWave(nx, ny) {
  const p = worldAt(nx, ny, new THREE.Vector3());
  U.uWave.value.set(p.x, p.y, 0, 0); waveStart = clockT;
  BU.uClick.value.set(nx * .5 + .5, ny * .5 + .5, 0);
}
const rel = e => { const r = host.getBoundingClientRect(); return [(e.clientX - r.left) / Math.max(1, r.width) * 2 - 1, -((e.clientY - r.top) / Math.max(1, r.height) * 2 - 1)]; };
host.addEventListener('pointermove', e => { const p = rel(e); mouse.x = p[0]; mouse.y = p[1]; mouse.on = true; });
host.addEventListener('pointerleave', () => { mouse.on = false; });
host.addEventListener('pointerdown', e => {
  const p = rel(e), nx = p[0], ny = p[1];
  mouse.x = nx; mouse.y = ny; mouse.on = true;
  fireWave(nx, ny);
  if (introDone) {
    gsap.fromTo(U.uEyePop, { value: 1.35 }, { value: 1, duration: 1.3, ease: 'elastic.out(1,.35)', overwrite: true });
  }
});

/* =================== TIMELINE (≈18.5 s) =================== */
const shapes = {};
const tl = gsap.timeline({ paused: true, onComplete: startIdle });
function morph(at, shape, dur, mode) {
  tl.call(() => setTarget(shapes[shape], mode), null, at);
  tl.fromTo(U.uMorph, { value: 0 }, { value: 1, duration: dur, ease: 'none', immediateRender: false }, at);
}
function build() {
  // ACTO 1 · caos: polvo creativo en órbita
  tl.fromTo(BU.uIntro, { value: 0 }, { value: 1, duration: 2.5, ease: 'power2.out' }, 0)
    .fromTo(S, { camZ: 24, rotY: -.6, posY: 0 }, { camZ: 15, rotY: .9, duration: 2.6, ease: 'power2.out' }, 0)
    .fromTo(U.uScatter, { value: 1 }, { value: .35, duration: 2.2, ease: 'power2.out' }, 0);

  // ACTO 2 · el caos se ordena en el logotipo (grande, en 3D)
  morph(2.2, 'tbv', 1.8, 'sweep');
  tl.to(U.uScatter, { value: 0, duration: 1, ease: 'power2.out' }, 2.2)
    .to(S, { rotY: 0, camZ: camWords, duration: 1.8, ease: 'expo.inOut' }, 2.2)
    .call(() => fireWave(0, 0), null, 4.1)
    .to(S, { rotY: .3, rotX: -.08, duration: 1.4, ease: 'sine.inOut' }, 4.0)
    .to(S, { rotY: -.26, rotX: .06, duration: 1.4, ease: 'sine.inOut' }, 5.4);

  // ACTO 3 · corte: todo cae en la línea
  morph(6.9, 'line', 1.1, 'random');
  tl.to(S, { rotY: 0, rotX: 0, camZ: camFace, posY: SHIFT, duration: 1.3, ease: 'expo.inOut' }, 6.9);

  // ACTO 4 · la cara nace desde la línea, con el logotipo debajo
  morph(8.2, 'face', 2.3, 'center');
  tl.call(() => fireWave(0, .1), null, 8.3)
    .fromTo(S, { rotY: -1.1 }, { rotY: 0, duration: 3, ease: 'expo.out', immediateRender: false }, 8.2)
    .fromTo(BU.uFaceGlow, { value: 0 }, { value: 1, duration: 2, ease: 'power2.out' }, 8.4)
    .set(U.uFace, { value: 1 }, 10.1)
    .fromTo(U.uSmile, { value: 0 }, { value: 1, duration: .9, ease: 'power2.inOut' }, 10.2)
    .fromTo(U.uEyePop, { value: 0 }, { value: 1, duration: .9, ease: 'back.out(2.5)' }, 10.5)
    // personalidad: mira a un lado, al otro, guiña
    .to(S, { lookX: -1, lookY: .2, duration: .5, ease: 'power3.inOut' }, 11.5)
    .to(S, { lookX: 1, lookY: -.1, duration: .6, ease: 'power3.inOut' }, 12.3)
    .to(S, { lookX: 0, lookY: 0, duration: .5, ease: 'power3.inOut' }, 13.1)
    .to(U.uEyeR, { value: .05, duration: .09, ease: 'power2.in' }, 13.6)
    .to(U.uEyeR, { value: 1, duration: .28, ease: 'back.out(2)' }, 13.69)
    // las dos mitades se separan y se vuelven a unir
    .to(S, { splitAuto: 1, duration: .7, ease: 'expo.out' }, 14.3)
    .to(S, { splitAuto: 0, duration: 1.2, ease: 'elastic.out(1,.45)' }, 15.1)
    .to({}, { duration: .01 }, 16.8);
}

/* =================== IDLE vivo =================== */
let idleTw = [], blinkCall = null;
function blink() {
  blinkCall = gsap.delayedCall(2 + rand() * 3.5, () => {
    if (!introDone) return;
    const both = rand() < .75, targets = both ? [U.uEyeL, U.uEyeR] : [rand() < .5 ? U.uEyeL : U.uEyeR];
    gsap.timeline().to(targets, { value: .05, duration: .08, ease: 'power2.in' }).to(targets, { value: 1, duration: .25, ease: 'back.out(2)' });
    blink();
  });
}
function startIdle() {
  if (introDone) return;
  introDone = true;
  Lab.hero.introDone();
  scheduleIntro();
  idleTw.push(gsap.to(S, { idle: 1, duration: 1.5, ease: 'power2.inOut' }));
  if (!reduce) blink();
}
function replay() {
  Lab.hero.introStarted();
  introDone = false;
  idleTw.forEach(t => t.kill()); idleTw = []; blinkCall && blinkCall.kill();
  S.idle = 0; U.uSplit.value = 0; U.uEyeL.value = 1; U.uEyeR.value = 1;
  setInstant(shapes.chaos); U.uMorph.value = 1; U.uFace.value = 0;
  tl.restart();
}
let introTimer = null;
function scheduleIntro() {
  clearTimeout(introTimer);
  if (CFG.intro > 0 && !reduce) introTimer = setTimeout(() => { if (introDone) replay(); scheduleIntro(); }, CFG.intro * 60000);
}
addEventListener('keydown', e => { if ((e.key === 'r' || e.key === 'R') && rafId && !/input|textarea|select/i.test((e.target && e.target.tagName) || '')) replay(); });

/* =================== RENDER =================== */
function resize() {
  renderer.setSize(W(), H(), false);
  camera.aspect = aspect(); camera.updateProjectionMatrix();
  BU.uRes.value.set(W(), H());
  if (introDone) { S.camZ = camFace(); S.posY = SHIFT; }
}
addEventListener('resize', resize);
if (typeof ResizeObserver !== 'undefined') new ResizeObserver(resize).observe(host);

const clock = new THREE.Clock(); let last = 0; const proj = new THREE.Vector3();
let acc = 0, lastRaw = 0;
let rafId = 0;
function frame(now) {
  rafId = requestAnimationFrame(frame);
  if (document.hidden) return;
  now = (now || 0) / 1000; acc += now - lastRaw; lastRaw = now;
  if (acc < 1 / CFG.fps - .002) return; acc = 0;
  const t = clock.getElapsedTime(), dt = Math.min(.1, t - last); last = t; clockT = t;
  const time = reduce ? t * .3 : t;
  U.uTime.value = time; BU.uTime.value = time; DU.uTime.value = time;

  const ease = Math.min(1, dt * 5);
  mouse.sx += (mouse.x - mouse.sx) * ease; mouse.sy += (mouse.y - mouse.sy) * ease;

  group.rotation.y = S.rotY + S.idle * mouse.sx * .45;
  group.rotation.x = S.rotX - S.idle * mouse.sy * .3;
  group.position.y = S.posY + S.idle * Math.sin(t * .9) * .06;
  camera.position.set(mouse.sx * .35 * S.idle, mouse.sy * .25 * S.idle, S.camZ);
  camera.lookAt(0, S.posY * .35, 0);

  worldAt(mouse.sx, mouse.sy, mWorld);
  U.uMouse.value.copy(mWorld);
  const mOnTarget = mouse.on ? (introDone ? 1 : .35) : 0;
  U.uMouseOn.value += (mOnTarget - U.uMouseOn.value) * ease;
  BU.uMouse.value.set(mouse.sx * .5 + .5, mouse.sy * .5 + .5);

  const lx = Math.max(-1, Math.min(1, mWorld.x / 3)), ly = Math.max(-1, Math.min(1, (mWorld.y - group.position.y) / 3));
  U.uLook.value.x += ((mouse.on && introDone ? lx : S.lookX) - U.uLook.value.x) * ease;
  U.uLook.value.y += ((mouse.on && introDone ? ly : S.lookY) - U.uLook.value.y) * ease;

  const overFace = introDone && mouse.on && Math.hypot(mWorld.x, mWorld.y - group.position.y) < R * 1.05;
  U.uSplit.value += (Math.max(overFace ? 1 : 0, S.splitAuto) - U.uSplit.value) * Math.min(1, dt * 6);

  const age = t - waveStart;
  U.uWave.value.w = age < 6 ? age : -1; BU.uClick.value.z = age < 6 ? age : -1;

  proj.copy(group.position).project(camera);
  BU.uFace.value.set(proj.x * .5 * aspect(), proj.y * .5);
  U.uCam.value = Math.max(.9, Math.min(2, S.camZ / 12));

  renderer.render(scene, camera);
}

/* =================== CONTROL DESDE LA PÁGINA =================== */
function skip() { if (!introDone) tl.progress(1, false); }
function setActive(on) {
  if (on && !rafId) { acc = 0; rafId = requestAnimationFrame(frame); }
  else if (!on && rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  gsap.globalTimeline.paused(!on);
}
function exportPoster() { renderer.render(scene, camera); return $('#hero-gl').toDataURL('image/webp', .85); }

/* =================== ARRANQUE =================== */
const fonts = document.fonts
  ? Promise.all([document.fonts.load('800 270px Syne'), document.fonts.load('700 150px Caveat')])
  : Promise.resolve();
Promise.race([fonts, new Promise(r => setTimeout(r, 2200))]).then(() => {
  const logo = sampleText();
  shapes.chaos = genChaos(); shapes.line = genLine(); shapes.tbv = genTBV(logo); shapes.face = genFace(logo);
  setInstant(shapes.chaos);
  build(); resize(); rafId = requestAnimationFrame(frame);
  Lab.hero.ready({ skip, replay, setActive, exportPoster });
  if (reduce || CFG.skipIntro) { tl.progress(1, false); startIdle(); }
  else { Lab.hero.introStarted(); gsap.delayedCall(.2, () => tl.play()); }
});
})();
