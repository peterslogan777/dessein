import*as t from"../vendor/three.module.min.js";const M=`
  attribute float aTaille; attribute float aPhase; attribute vec3 aCouleur;
  uniform float uTemps; uniform float uPixel; uniform vec2 uSouris;
  varying vec3 vCouleur; varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += mod(uTemps * (0.04 + aPhase * 0.05) + aPhase * 40.0, 40.0) - 20.0;   // mont\xE9e lente, en boucle
    p.x += sin(uTemps * 0.3 + aPhase * 6.2831) * 0.25 + uSouris.x * (p.z + 30.0) * 0.012;
    p.y += uSouris.y * (p.z + 30.0) * 0.008;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aTaille * uPixel * (60.0 / -mv.z);
    vCouleur = aCouleur;
    vAlpha = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTemps * (0.8 + aPhase) + aPhase * 20.0))) * smoothstep(-20.0, -14.0, p.y) * (1.0 - smoothstep(14.0, 20.0, p.y));
  }`,y=`
  varying vec3 vCouleur; varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    if (a < 0.01) discard;
    gl_FragColor = vec4(vCouleur, a * vAlpha);
  }`;export function demarrer(a,d){const i=new t.WebGLRenderer({canvas:a,alpha:!0,antialias:!1,powerPreference:"low-power"}),p=Math.min(window.devicePixelRatio||1,1.5);i.setPixelRatio(p);const w=new t.Scene,s=new t.PerspectiveCamera(55,1,.1,200);s.position.set(0,0,30);const n=window.innerWidth<700?900:2200,l=new Float32Array(n*3),m=new Float32Array(n),v=new Float32Array(n),c=new Float32Array(n*3),b=[new t.Color("#D4AF37"),new t.Color("#E9CF7A"),new t.Color("#E8D9B5"),new t.Color("#F7F3EA"),new t.Color("#7CCFC8")];for(let e=0;e<n;e++){l[e*3]=(Math.random()-.5)*70,l[e*3+1]=(Math.random()-.5)*40,l[e*3+2]=(Math.random()-.5)*40-5,m[e]=Math.random()<.06?3+Math.random()*3:.8+Math.random()*1.6,v[e]=Math.random();const o=b[Math.random()<.08?4:Math.floor(Math.random()*4)];c.set([o.r,o.g,o.b],e*3)}const r=new t.BufferGeometry;r.setAttribute("position",new t.BufferAttribute(l,3)),r.setAttribute("aTaille",new t.BufferAttribute(m,1)),r.setAttribute("aPhase",new t.BufferAttribute(v,1)),r.setAttribute("aCouleur",new t.BufferAttribute(c,3));const u={uTemps:{value:0},uPixel:{value:p},uSouris:{value:new t.Vector2}},h=new t.ShaderMaterial({vertexShader:M,fragmentShader:y,uniforms:u,transparent:!0,depthWrite:!1,blending:t.AdditiveBlending}),f=new t.Points(r,h);w.add(f);const A=new t.Vector2;window.addEventListener("pointermove",e=>{A.set((e.clientX/window.innerWidth-.5)*2,-(e.clientY/window.innerHeight-.5)*2)},{passive:!0});const C=()=>{const e=a.clientWidth||window.innerWidth,o=a.clientHeight||window.innerHeight;i.setSize(e,o,!1),s.aspect=e/o,s.updateProjectionMatrix()};C(),window.addEventListener("resize",C);let P=!0;new IntersectionObserver(([e])=>{P=e.isIntersecting}).observe(a);const g=e=>{!P||document.hidden||(u.uTemps.value=e,u.uSouris.value.lerp(A,.04),f.rotation.y=Math.sin(e*.05)*.08,i.render(w,s))};return d.ajouterRendu(g),requestAnimationFrame(()=>a.classList.add("est-pret")),{arreter:()=>{d.retirerRendu(g),i.dispose(),r.dispose(),h.dispose()}}}
